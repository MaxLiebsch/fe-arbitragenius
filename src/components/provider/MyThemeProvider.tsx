"use client";

import React, { ReactNode, useEffect } from "react";
import {
  useColorScheme,
} from "@mui/material/styles";
import { useThemeAtom } from "@/hooks/use-theme";

const MyThemeProvider = ({ children }: { children: ReactNode }) => {
  const { mode, setMode } = useColorScheme();
  const [{ mode: _mode }, setApperance] = useThemeAtom();

  useEffect(() => {
    if (_mode) {
      setMode(_mode === "dark" ? "dark" : "light");
    }
  }, [_mode, setMode]);

  return <>{children}</>;
};

export default MyThemeProvider;
