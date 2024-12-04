import { useEffect } from "react";
import usePreferences from "./use-preferences";
import { useTheme } from "next-themes";

export function useUserTheme() {
  const appearance = usePreferences("appearance");
  const { theme, systemTheme, setTheme } = useTheme();

  useEffect(() => {
    if (appearance.data) {
      const { mode } = appearance.data;
      if (mode === "system" && systemTheme) {
        setTheme(systemTheme);
      } else {
        setTheme(mode);
      }
    } else if (systemTheme) {
      setTheme(systemTheme);
    }
  }, [appearance.data, setTheme, systemTheme]);

  return { theme, systemTheme };
}
