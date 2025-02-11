import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { salesQueryKey } from "@/util/queryKeys";
import { useQuery } from "@tanstack/react-query";

import { useUserSettings } from "./use-settings";
import { GridSortItem } from "@mui/x-data-grid-premium";

export type ProductPagination = {
  page: number;
  pageSize: number;
};


export default function useSalesProducts(
  pagination: ProductPagination,
  sort: GridSortItem,
  target: string,
  refetchOnWindowFocus: boolean = true
) {
  // const queryClient = useQueryClient();
  const [settings, setUserSettings] = useUserSettings()

  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey: [
      ...salesQueryKey(target, pagination.page, pagination.pageSize),
      sort?.field,
      sort?.sort,
      ...(settings ? Object.values(settings) : []),
    ],
    enabled: !!target && !!settings,
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
        `/app/api/sales?target=${target}${pageQuery}${sortQuery}${settingsQuery}`
      ).then((resp) => resp.json());
    },
  });

  return productQuery;
}
