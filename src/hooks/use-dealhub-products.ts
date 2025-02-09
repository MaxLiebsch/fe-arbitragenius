import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { productQueryKey } from "@/util/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserSettings } from "./use-settings";
import { Week } from "@/types/Week";

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

export default function useDealhubProducts(
  pagination: ProductPagination,
  sort: ProductSort,
  target: string,
  week: Week
) {
  const defaultDomain = "dealhub";
  const queryClient = useQueryClient();
  const [settings, setUserSettings] = useUserSettings();
  const queryKey = [
    ...productQueryKey(
      target,
      defaultDomain,
      pagination.page,
      pagination.pageSize
    ),
    sort?.field,
    sort?.direction,
    ...(settings ? Object.values(settings) : []),
    week.start,
    week.end,
  ];

  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey,
    enabled: !!target && !!settings,
    queryFn: async () => {
      const { page, pageSize } = pagination;
      let sortQuery = "";
      let settingsQuery = "";
      let pageQuery = `&page=${page}&size=${pageSize}`;
      let weekSettings = `&start=${week.start}&end=${week.end}`;
      if (sort) sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
      if (settings) {
        settingsQuery = Object.keys(settings)
          .map((key) => `&${key}=${settings[key as keyof Settings]}`)
          .join("");
      }
      return fetch(
        `/app/api/deal-hub/${target}?${pageQuery}${sortQuery}${settingsQuery}${weekSettings}`
      ).then((resp) => resp.json());
    },
  });

  useEffect(() => {
    if (pagination.page < 10) {
      queryClient.prefetchQuery({
        queryKey: [
          ...productQueryKey(
            target,
            "dealhub",
            pagination.page + 1,
            pagination.pageSize
          ),
          sort?.field,
          sort?.direction,
          ...(settings ? Object.values(settings) : []),
          week.start,
          week.end,
        ],
        queryFn: async () => {
          const { page, pageSize } = pagination;
          let sortQuery = "";
          let settingsQuery = "";
          let pageQuery = `&page=${page + 1}&size=${pageSize}`;
          const weekSettings = `&start=${week.start}&end=${week.end}`;
          if (sort)
            sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;

          if (settings) {
            settingsQuery = Object.keys(settings)
              .map((key) => `&${key}=${settings[key as keyof Settings]}`)
              .join("");
          }
          return fetch(
            `/app/api/deal-hub/${target}?${sortQuery}${settingsQuery}${pageQuery}${weekSettings}`
          ).then((resp) => resp.json());
        },
      });
    }
  }, [
    productQuery.data,
    week.start,
    week.end,
    target,
    pagination,
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
