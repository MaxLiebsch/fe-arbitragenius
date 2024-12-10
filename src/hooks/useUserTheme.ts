import { useCallback, useEffect } from "react";
import usePreferences from "./use-preferences";
import { useTheme } from "next-themes";
import { useThemeAtom } from "./use-theme";

export function useUserTheme() {
  const appearance = usePreferences("appearance");
  const { theme, systemTheme, setTheme } = useTheme();
  const [{ mode }, setApperance] = useThemeAtom();

  const updateFavicon = useCallback(() => {
    // Create a completely new link element
    const link = document.createElement("link");
    link.rel = "icon";
    link.href =
      theme === "dark"
        ? "/app/favicon-dark.ico?v=" + Date.now()
        : "/app/favicon-light.ico?v=" + Date.now();

    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach((el) => el.remove());

    // Add new favicon
    document.head.appendChild(link);

    // Additional browser trigger techniques
    try {
      window.dispatchEvent(new Event("focus"));
    } catch (e) {
      console.warn("Could not dispatch focus event");
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appearance.data) {
      const { mode } = appearance.data;
      if (mode === "system" && systemTheme) {
        setTheme(systemTheme);
        setApperance({ mode: systemTheme });
      } else {
        setTheme(mode);
        setApperance({ mode });
      }
      updateFavicon();
    } else if (systemTheme) {
      setTheme(systemTheme);
      setApperance({ mode: systemTheme });
      updateFavicon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appearance.data]);

  return { theme, systemTheme };
}
