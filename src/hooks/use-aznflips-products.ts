import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { aznFlipsQueryKey, salesQueryKey } from "@/util/queryKeys";
import { useQuery } from "@tanstack/react-query";

import { useUserSettings } from "./use-settings";
import { GridSortItem } from "@mui/x-data-grid-premium";

export type ProductPagination = {
  page: number;
  pageSize: number;
};


export default function useAznFlipsProducts(
  pagination: ProductPagination,
  sort: GridSortItem,
  target: string,
  refetchOnWindowFocus: boolean = true
) {
  const [settings, setUserSettings] = useUserSettings();
  const targetEnabled = settings && settings.targetPlatforms && settings.targetPlatforms.includes(target); 
  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey: [
      ...aznFlipsQueryKey(pagination.page, pagination.pageSize),
      sort?.field,
      sort?.sort,
      ...(settings ? Object.values(settings) : []),
    ],
    enabled: !!target && !!settings && targetEnabled,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { page, pageSize } = pagination;
      let sortQuery = "";
      let settingsQuery = "";
      let pageQuery = `&page=${page}&size=${pageSize}`;
      if (sort) sortQuery = `&sortby=${sort.field}&sortorder=${sort.sort}`;
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
