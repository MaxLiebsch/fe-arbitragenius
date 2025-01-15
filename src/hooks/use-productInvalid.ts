import { productQueryKey } from "@/util/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductPagination } from "./use-aznflips-products";
import { ModifiedProduct } from "@/types/Product";

export function useProductInvalid({
  target,
  domain,
  pagination,
}: {
  target: string;
  domain: string;
  pagination: ProductPagination;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    // onMutate: async (variables) => {
    //   const { productId } = variables;
    //   const { page, pageSize } = pagination;
    //   const queryKey = productQueryKey(target, domain, page, pageSize);
    //   await queryClient.cancelQueries({ queryKey, exact: false });
    //   const previousQuery = queryClient.getQueriesData({
    //     queryKey,
    //     exact: false,
    //   });
    //   if (previousQuery.length) {
    //     const previousQueryData = previousQuery[0];
    //     const originalProducts = previousQueryData[1] as ModifiedProduct[];
    //     const products = originalProducts.filter((product) => product._id !== productId)
    //     queryClient.setQueryData(
    //       previousQueryData,
    //       products
    //     );
    //   }
    // },
    mutationFn: async ({ productId }: { productId: string }) => {
      return fetch(
        `/app/api/shop/${domain}/${target}/product/${productId}/invalid`
      );
    },
    onSettled(data, error, variables, context) {  
      const { page, pageSize } = pagination;
      const queryKey = productQueryKey(target, domain, page, pageSize);
      queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
    },
  });
}
