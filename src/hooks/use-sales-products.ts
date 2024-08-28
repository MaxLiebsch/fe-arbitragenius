import { ModifiedProduct, Product } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { salesQueryKey } from "@/util/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserSettings } from "./use-settings";

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

export default function useSalesProducts(
  pagination: ProductPagination,
  sort: ProductSort,
  target: string,
  refetchOnWindowFocus: boolean = true
) {
  const queryClient = useQueryClient();
  const [settings, setUserSettings] = useUserSettings()

  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey: [
      ...salesQueryKey(target, pagination.page, pagination.pageSize),
      sort?.field,
      sort?.direction,
      ...(settings ? Object.values(settings) : []),
    ],
    enabled: !!target && !!settings,
    refetchOnWindowFocus,
    queryFn: async () => {
      const { page, pageSize } = pagination;
      let sortQuery = "";
      let settingsQuery = "";
      let pageQuery = `&page=${page}&size=${pageSize}`;
      if (sort) sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
      if (settings) {
        settingsQuery = Object.keys(settings)
          .map((key) => `&${key}=${settings[key as keyof Settings]}`)
          .join("");
      }
      return fetch(
        `/app/api/sales?target=${target}${pageQuery}${sortQuery}${settingsQuery}`
      ).then((resp) => resp.json());
    },
  });

  useEffect(() => {
    if (pagination.page < 10) {
      queryClient.prefetchQuery({
        queryKey: [
          ...salesQueryKey(target, pagination.page + 1, pagination.pageSize),
          sort?.field,
          sort?.direction,
        ],
        queryFn: async () => {
          const { page, pageSize } = pagination;
          let sortQuery = "";
          let settingsQuery = "";
          let pageQuery = `&page=${page}&size=${pageSize}`;
          if (sort)
            sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
          if (settings) {
            settingsQuery = Object.keys(settings)
              .map((key) => `&${key}=${settings[key as keyof Settings]}`)
              .join("");
          }
          return fetch(
            `/app/api/sales?target=${target}${settingsQuery}${pageQuery}${sortQuery}`
          ).then((resp) => resp.json());
        },
      });
    }
  }, [
    productQuery.data,
    target,
    settings,
    pagination,
    pagination.page,
    pagination.pageSize,
    sort,
    sort?.field,
    sort?.direction,
    queryClient,
  ]);

  return productQuery;
}
