import { Settings } from "@/types/Settings";
import { countQueryKey } from "@/util/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useUserSettings } from "./use-settings";

export default function useSalesCount(
  target: string,
  refetchOnWindowFocus: boolean = true
) {
  let settingsQuery = "";
  const [settings, setUserSettings] = useUserSettings() 
  if (settings) {
    settingsQuery = Object.keys(settings)
      .map((key) => `&${key}=${settings[key as keyof Settings]}`)
      .join("");
  }
  const targetEnabled = settings && settings.targetPlatforms && settings.targetPlatforms.includes(target);
  return useQuery<{ productCount: number; totalProductsToday: number }>({
    queryKey: [
      ...countQueryKey(target, 'sales') ,
      ...(settings ? Object.values(settings) : []),
    ],
    enabled: !!settings?.loaded && targetEnabled,
    queryFn: () =>
      fetch(`/app/api/sales/count?target=${target}${settingsQuery}`).then((resp) =>
        resp.json()
      ),
  });
}
