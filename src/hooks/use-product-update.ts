import { ProductUpdate } from "@/types/ProductUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductPagination } from "./use-products";
import { ModifiedProduct } from "@/types/Product";
import { calculateAznArbitrage } from "@/util/calculateAznArbitrage";
import {
  calculateEbyArbitrage,
  findMappedCategory,
} from "@/util/calculateEbyArbitrage";
import { countQueryKey, productQueryKey } from "@/util/queryKeys";

export default function useProductUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: {
      target: string;
      domain: string;
      productId: string;
      update: ProductUpdate;
      pagination: ProductPagination;
    }) => {
      const { domain, update, productId } = options;
      const response = await fetch(
        `/app/api/shop/${domain}/product/${productId}`,
        {
          method: "POST",
          body: JSON.stringify(update),
        }
      );

      if (!response.ok) throw new Error();
    },
    onMutate: async (variables) => {
      const { domain, productId, update, pagination } = variables;
      const { page, pageSize } = pagination;
      const {
        qty,
        a_qty,
        e_qty,
        originalAQty,
        originalQty,
        originalAsin,
        asin,
        sourceOutdated,
        eTargetCorrect,
        aTargetCorrect,
        originalEQty,
        originalEsin,
        esin,
        eanCorrect,
      } = update;

      const queryKey = productQueryKey(
        variables.target,
        domain,
        page,
        pageSize
      );
      await queryClient.cancelQueries({ queryKey, exact: false });
      const previousQuery = queryClient.getQueriesData({
        queryKey,
        exact: false,
      });
      if (previousQuery.length) {
        const previousQueryData = previousQuery[0];
        const originalProducts = previousQueryData[1] as ModifiedProduct[];
        let product = originalProducts.find((p) => p._id === productId);
        if (!product) return;
        const { prc, a_prc, e_prc, costs, tax, ebyCategories } = product;
        if (!eanCorrect || asin !== originalAsin) {
          const products = originalProducts.filter(
            (p) => p._id !== variables.productId
          );
          queryClient.setQueryData(previousQueryData[0], products);
        } else {
          if (sourceOutdated || !eTargetCorrect || !aTargetCorrect) {
            const products = originalProducts.filter(
              (p) => p._id !== variables.productId
            );
            queryClient.setQueryData(previousQueryData[0], products);
          } else {
            if (costs && asin === originalAsin && a_qty !== originalAQty) {
              const { prc, a_prc, costs, tax } = product;
              const result = calculateAznArbitrage(
                prc * (a_qty / qty), // EK
                a_prc, // VK
                costs,
                tax
              );

              if (result.a_mrgn > 0) {
                product.qty = qty;
                product.a_qty = a_qty;
                const products = originalProducts.map((product) => {
                  if (product._id === variables.productId) {
                    return {
                      ...product,
                      ...result,
                    };
                  }
                  return product;
                });
                queryClient.setQueryData(previousQueryData[0], products);
              } else {
                const products = originalProducts.filter(
                  (p) => p._id !== variables.productId
                );
                queryClient.setQueryData(previousQueryData[0], products);
              }
            }
            if (
              ebyCategories?.length &&
              esin === originalEsin &&
              e_qty !== originalEQty
            ) {
              const mappedCategories = findMappedCategory([
                ebyCategories[0].id,
              ]);
              if (mappedCategories) {
                const ebyArbitrage = calculateEbyArbitrage(
                  mappedCategories,
                  e_prc,
                  prc * (e_qty / qty)
                );
                if (ebyArbitrage) {
                  product = {
                    ...product,
                    ...ebyArbitrage,
                  };
                  const products = originalProducts.map((product) => {
                    if (product._id === variables.productId) {
                      return product;
                    }
                    return product;
                  });
                  queryClient.setQueryData(previousQueryData[0], products);
                }
              }
            }
            if (qty !== originalQty) {
              product.qty = qty;
              if (aTargetCorrect && costs && asin === originalAsin) {
                const result = calculateAznArbitrage(
                  prc * (a_qty / qty), // EK
                  a_prc, // VK
                  costs,
                  tax
                );
                if (result.a_mrgn > 0) {
                  product = {
                    ...product,
                    ...result,
                  };
                }
              }
              if (
                eTargetCorrect &&
                esin === originalEsin &&
                ebyCategories?.length > 0
              ) {
                const mappedCategories = findMappedCategory([
                  product.ebyCategories[0].id,
                ]);
                if (mappedCategories) {
                  const ebyArbitrage = calculateEbyArbitrage(
                    mappedCategories,
                    e_prc,
                    prc * (e_qty / qty)
                  );
                  if (ebyArbitrage) {
                    product = {
                      ...product,
                      ...ebyArbitrage,
                    };
                  }
                }
              }
              const products = originalProducts.map((product) => {
                if (product._id === variables.productId) {
                  return product;
                }
                return product;
              });
              queryClient.setQueryData(previousQueryData[0], products);
            }
          }
        }
      }
    },
    onSettled: (data, error, variables, context) => {
      const { domain, target } = variables;
      const { page, pageSize } = variables.pagination;
      if (variables) {
        const queryKey = productQueryKey(target, domain, page, pageSize);
        queryClient.invalidateQueries({ queryKey, exact: false });
        queryClient.invalidateQueries({
          queryKey: countQueryKey(target, domain),
          exact: false,
        });
      }
    },
    onError: (err, domain, context) => {
      console.log("err:", err);
    },
  });
}
