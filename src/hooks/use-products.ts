import { ModifiedProduct, Product } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export type ProductPagination = {
  page: number;
  pageSize: number;
};

export type ProductSort =
  | undefined
  | {
      field: string;
      direction: "asc" | "desc";
    };

export default function useProducts(
  domain: string,
  pagination: ProductPagination,
  sort: ProductSort,
  target: string,
  settings: Settings,
  refetchOnWindowFocus: boolean = true
) {
  const queryClient = useQueryClient();

  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey: [
      target,
      "shop",
      domain,
      "product",
      pagination.page,
      pagination.pageSize,
      sort?.field,
      sort?.direction,
      ...(settings ? Object.values(settings) : []),
    ],
    enabled: !!domain && !!target && !!settings,
    refetchOnWindowFocus,
    queryFn: async () => {
      let sortQuery = "";
      let settingsQuery = "";
      if (sort) sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
      if (settings) {
        settingsQuery = Object.keys(settings)
          .map((key) => `&${key}=${settings[key as keyof Settings]}`)
          .join("");
      }
      return fetch(
        `/app/api/shop/${domain}/${target}/product?page=${pagination.page}&size=${pagination.pageSize}${sortQuery}${settingsQuery}`
      ).then((resp) => resp.json());
    },
  });

  useEffect(() => {
    if (pagination.page < 10) {
      queryClient.prefetchQuery({
        queryKey: [
          "shop",
          domain,
          "product",
          pagination.page + 1,
          pagination.pageSize,
          sort?.field,
          sort?.direction,
        ],
        queryFn: async () => {
          let sortQuery = "";
          if (sort)
            sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
          return fetch(
            `/app/api/shop/${domain}/${target}/product?productsWithNoBsr=${
              settings.productsWithNoBsr
            }&maxSecondaryBsr=${settings.maxSecondaryBsr}&maxPrimaryBsr=${
              settings.maxPrimaryBsr
            }&minMargin=${settings.minMargin}&minPercentageMargin=${
              settings.minPercentageMargin
            }&page=${pagination.page + 1}&size=${
              pagination.pageSize
            }${sortQuery}`
          ).then((resp) => resp.json());
        },
      });
    }
  }, [
    productQuery.data,
    domain,
    target,
    settings,
    pagination.page,
    pagination.pageSize,
    sort,
    sort?.field,
    sort?.direction,
    queryClient,
  ]);

  return productQuery;
}
