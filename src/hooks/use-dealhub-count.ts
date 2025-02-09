import { Settings } from "@/types/Settings";
import { useQuery } from "@tanstack/react-query";
import { useUserSettings } from "./use-settings";
import { Week } from "@/types/Week";

export default function useDealhubProductCount(target: string, week: Week) {
  let settingsQuery = "";
  const [settings, setUserSettings] = useUserSettings();
  if (settings) {
    settingsQuery = Object.keys(settings)
      .map((key) => `&${key}=${settings[key as keyof Settings]}`)
      .join("");
  }
  const targetEnabled =
    settings &&
    settings.targetPlatforms &&
    settings.targetPlatforms.includes(target);

  const defaultDomain = "dealhub";
  return useQuery<{ productCount: number }>({
    queryKey: [
      target,
      defaultDomain,
      "product",
      "count",
      ...(settings ? Object.values(settings) : []),
      week.start,
      week.end,
    ],
    enabled: !!target && !!settings && targetEnabled,
    queryFn: () =>
      fetch(
        `/app/api/deal-hub/${target}/count?${settingsQuery}&start=${week.start}&end=${week.end}`
      ).then((resp) => resp.json()),
  });
}
