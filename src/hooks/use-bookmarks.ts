import { BookMarkReturn } from "@/types/Bookmarks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserSettings } from "./use-settings";
import { Settings } from "@/types/Settings";

export default function useBookmarks(refetchOnWindowFocus: boolean = true) {

  let settingsQuery = "";
  const [settings, setUserSettings] = useUserSettings();
  if (settings) {
    settingsQuery = Object.keys(settings)
      .map((key) => `&${key}=${settings[key as keyof Settings]}`)
      .join("");
  }
  const productQuery = useQuery<BookMarkReturn>({
    queryKey: ["bookmarks"],
    refetchOnWindowFocus,
    queryFn: async () => {
      return fetch(`/app/api/user/bookmarks?${settingsQuery}`).then((resp) => resp.json());
    },
  });

  return productQuery;
}
