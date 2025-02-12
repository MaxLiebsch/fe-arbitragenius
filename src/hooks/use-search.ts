import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserSettings } from "./use-settings";
import { usePaginationAndSort } from "./use-pagination-sort";
import { Settings } from "@/types/Settings";
import { ModifiedProduct } from "@/types/Product";
import { productQueryKey } from "@/util/queryKeys";

export default function useSearch({
  query,
  target,
}: {
  query?: string;
  target?: string;
}) {
  const [settings] = useUserSettings();
  const { paginationModel, sortModel } = usePaginationAndSort();
  const { page, pageSize } = paginationModel;
  const { sort, field } = sortModel;
  return useQuery({
    enabled: Boolean(query && query.length > 3 && target),
    queryKey: [
      ...productQueryKey(target || "a", "search", page, pageSize),
      query,
      field,
      sort,
      ...(settings ? Object.values(settings) : []),
    ],
    queryFn: async () => {
      let sortQuery = "";
      let settingsQuery = "";
      let pageQuery = `&page=${page}&size=${pageSize}`;
      if (sortModel)
        sortQuery = `&sortby=${sortModel.field}&sortorder=${sortModel.sort}`;
      if (settings) {
        settingsQuery = Object.keys(settings)
          .map((key) => `&${key}=${settings[key as keyof Settings]}`)
          .join("");
      }
      const response = await axios.get(
        `/app/api/search?q=${query}&target=${target}${settingsQuery}${sortQuery}${pageQuery}`
      );
      return response.data as ModifiedProduct[];
    },
  });
}
