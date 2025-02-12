import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserSettings } from "./use-settings";
import { Settings } from "@/types/Settings";

export default function useSearchCount({
  query,
  target,
}: {
  query?: string;
  target?: string;
}) {
  const [settings] = useUserSettings();
  return useQuery<{ productCount: number }>({
    enabled: Boolean(query && query.length > 3 && target),
    queryKey: [
      target,
      "shop",
      "search",
      "product",
      "count",
      query,
      ...(settings ? Object.values(settings) : []),
    ],
    queryFn: async () => {
      let settingsQuery = "";
      if (settings) {
        settingsQuery = Object.keys(settings)
          .map((key) => `&${key}=${settings[key as keyof Settings]}`)
          .join("");
      }
      const response = await axios.get(
        `/app/api/search/count?q=${query}&target=${target}${settingsQuery}`
      );
      return response.data;
    },
  });
}
