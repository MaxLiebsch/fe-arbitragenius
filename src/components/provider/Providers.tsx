"use client";
import { ReactNode, useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import MuiProvider from "@/components/provider/MuiProvider";
import { ConfigProvider } from "antd";
import tw from "../../../tailwind.config";
import { DevTools } from "jotai-devtools";
import useAccount from "@/hooks/use-account";
import { useUserSettings } from "@/hooks/use-settings";
import { defaultSettings } from "@/constant/defaultSettings";
import { differenceInDays } from "date-fns";

export default function Providers({ children }: { children: ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const accountQuery = useAccount();
  const [settings, setUserSettings] = useUserSettings();

  useEffect(() => {
    const prefs = accountQuery.data?.prefs;
    if (accountQuery.data && prefs) {
      const settings = prefs.settings;
      if (settings) {
        const updatedSettings = {
          ...defaultSettings,
          ...JSON.parse(settings),
          loaded: true,
        }
        setUserSettings(updatedSettings);
      } else {
        const today = Date.now();
        const registrationDate = new Date(accountQuery.data.registration);
        if (differenceInDays(today, registrationDate) < 7) {
          setUserSettings({
            ...defaultSettings,
            loaded: true,
          });
        }
      }
    }
  }, [accountQuery.data, setUserSettings]);

  return (
    <>
      <SnackbarProvider />
      <MuiProvider>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              //@ts-ignore
              colorPrimary: tw.theme.extend.colors["primary"]["500"],
              borderRadius: 2,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </MuiProvider>
      <DevTools />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </>
  );
}
