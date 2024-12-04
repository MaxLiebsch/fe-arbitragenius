"use client";

import React, { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import theme from "../../../tailwind.config";
import { useTheme } from "next-themes";
import { useUserTheme } from "@/hooks/useUserTheme";

const colors = theme.theme?.extend?.colors as {
  primary: {
    [key: string]: string;
  };
  secondary: {
    [key: string]: string;
  };
};

const MuiProvider = ({ children }: { children: ReactNode }) => {
  const { theme, systemTheme} = useUserTheme()
  const muitheme = createTheme({
    colorSchemes: {
      dark: theme === "dark" && true,
      light: theme === "light" && true,
    },
    palette: {
      primary: {
        light: colors!["primary"][500],
        main: colors!["primary"][700],
        dark: colors!["primary"][950],
        contrastText: "#fff",
      },
      secondary: {
        light: colors!["secondary"][300],
        main: colors!["secondary"][500],
        dark: colors!["secondary"][700],
        contrastText: "#000",
      },
    },
    typography: {},
  });
  return (
    <ThemeProvider theme={muitheme}>
      {children}
    </ThemeProvider>
  );
};

export default MuiProvider;
