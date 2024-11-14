import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { aznFlipsQueryKey, salesQueryKey } from "@/util/queryKeys";
import { useQuery } from "@tanstack/react-query";

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

export default function useAznFlipsProducts(
  pagination: ProductPagination,
  sort: ProductSort,
  target: string,
  refetchOnWindowFocus: boolean = true
) {
  const [settings, setUserSettings] = useUserSettings();

  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey: [
      ...aznFlipsQueryKey(pagination.page, pagination.pageSize),
      sort?.field,
      sort?.direction,
      ...(settings ? Object.values(settings) : []),
    ],
    enabled: !!target && !!settings,
    refetchOnWindowFocus: false,
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
        `/app/api/azn-flips?target=${target}${pageQuery}${sortQuery}${settingsQuery}`
      ).then((resp) => resp.json());
    },
  });

  return productQuery;
}
