import { Settings } from "@/types/Settings";
import { useQuery } from "@tanstack/react-query";

export default function useSalesCount(
  target: string,
  settings: Settings | undefined,
  refetchOnWindowFocus: boolean = true
) {
  let settingsQuery = "";
  if (settings) {
    settingsQuery = Object.keys(settings)
      .map((key) => `&${key}=${settings[key as keyof Settings]}`)
      .join("");
  }
  return useQuery<{ productCount: number; totalProductsToday: number }>({
    queryKey: [
      target,
      "sales",
      "count",
      ...(settings ? Object.values(settings) : []),
    ],
    staleTime: 1000 * 60 * 5,
    enabled: !!target && !!settings,
    refetchOnWindowFocus,
    queryFn: () =>
      fetch(`/app/api/sales/count?target=${target}${settingsQuery}`).then((resp) =>
        resp.json()
      ),
  });
}
