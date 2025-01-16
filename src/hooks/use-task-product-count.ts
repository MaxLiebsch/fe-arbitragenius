import { useQuery } from "@tanstack/react-query";
import { useUserSettings } from "./use-settings";
import { Settings } from "@/types/Settings";

export default function useTaskProductCount(taskId?: string) {
   let settingsQuery = "";
    const [settings, setUserSettings] = useUserSettings();
    if (settings) {
      settingsQuery = Object.keys(settings)
        .map((key) => `&${key}=${settings[key as keyof Settings]}`)
        .join("");
    }
  return useQuery<number>({
    queryKey: ["task", "product", "count", taskId,...(settings ? Object.values(settings) : [])],
    enabled: !!taskId,
    queryFn: () =>
      fetch(`/app/api/tasks/${taskId}/product/count?${settingsQuery}`).then((resp) =>
        resp.json()
      ),
  });
}
