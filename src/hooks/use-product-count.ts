import { Settings } from "@/types/Settings";
import { useQuery } from "@tanstack/react-query";
import { useUserSettings } from "./use-settings";

export default function useProductCount(
  domain: string,
  target: string,
  refetchOnWindowFocus: boolean = true
) {
  let settingsQuery = "";
  const [settings, setUserSettings] = useUserSettings();
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
      ...(settings ? Object.values(settings) : []),
    ],
    staleTime: 1000 * 60 * 5,
    enabled: !!domain && !!target && !!settings,
    refetchOnWindowFocus,
    queryFn: () =>
      fetch(
        `/app/api/shop/${domain}/${target}/product/count?${settingsQuery}`
      ).then((resp) => resp.json()),
  });
}
