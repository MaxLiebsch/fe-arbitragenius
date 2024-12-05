"use client";

import React, { ReactNode, useEffect } from "react";
import { ThemeProvider, createTheme, useColorScheme } from "@mui/material/styles";
import theme from "../../../tailwind.config";

const colors = theme.theme?.extend?.colors as {
  primary: {
    [key: string]: string;
  };
  secondary: {
    [key: string]: string;
  };
};

const MuiProvider = ({ children }: { children: ReactNode }) => {

  const muitheme = createTheme({
    colorSchemes: {
      dark: true,
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
