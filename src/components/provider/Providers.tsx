"use client";
import { ReactNode, useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import MuiProvider from "@/components/provider/MuiProvider";
import { ConfigProvider, theme } from "antd";
import tw from "../../../tailwind.config";
import { DevTools } from "jotai-devtools";
import useAccount from "@/hooks/use-account";
import { useUserSettings } from "@/hooks/use-settings";
import { defaultSettings } from "@/constant/defaultSettings";
import { useUserTheme } from "@/hooks/useUserTheme";
import MyThemeProvider from "./MyThemeProvider";

const { defaultAlgorithm, darkAlgorithm } = theme;

export default function Providers({ children }: { children: ReactNode }) {
  const accountQuery = useAccount();
  const [settings, setUserSettings] = useUserSettings();
  const { theme, systemTheme } = useUserTheme();
  const darkMode = theme === "dark";

  useEffect(() => {
    const prefs = accountQuery.data?.prefs;
    if (accountQuery.data && prefs) {
      const settings = prefs.settings;
      if (settings) {
        const updatedSettings = {
          ...defaultSettings,
          ...JSON.parse(settings),
          loaded: true,
        };
        setUserSettings(updatedSettings);
      } else {
        setUserSettings({
          ...defaultSettings,
          loaded: true,
        });
      }
    }
  }, [accountQuery.data, setUserSettings, darkMode]);

  return (
    <>
      <SnackbarProvider />
      <MuiProvider>
        <MyThemeProvider>
          <ConfigProvider
            theme={{
              algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
              token: {
                colorPrimary: darkMode
                  ? (tw.theme as any).extend.colors["darkText"]
                  : (tw.theme as any).extend.colors["primary"]["500"],
                borderRadius: 2,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </MyThemeProvider>
      </MuiProvider>
      <DevTools />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </>
  );
}
