import { Settings } from "@/types/Settings";
import { useQuery } from "@tanstack/react-query";

export default function useProductCount(
  domain: string,
  target: string,
  settings: Settings,
  refetchOnWindowFocus: boolean = true
) {
  let settingsQuery = "";
  if (settings) {
    settingsQuery = Object.keys(settings)
      .map((key) => `&${key}=${settings[key as keyof Settings]}`)
      .join("");
  }
  return useQuery<{ productCount: number }>({
    queryKey: [
      target,
      "shop",
      domain,
      "product",
      "count",
      ...Object.values(settings),
    ],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus,
    queryFn: () =>
      fetch(
        `/app/api/shop/${domain}/${target}/product/count?${settingsQuery}`
      ).then((resp) => resp.json()),
  });
}
