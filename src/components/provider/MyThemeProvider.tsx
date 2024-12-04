"use client";

import React, { ReactNode, useEffect } from "react";
import { ThemeProvider, createTheme, useColorScheme } from "@mui/material/styles";
import { useUserTheme } from "@/hooks/useUserTheme";

const MyThemeProvider = ({ children }: { children: ReactNode }) => {
  const { mode, setMode } = useColorScheme();
  const {theme, systemTheme} = useUserTheme() 
  console.log('mode:', mode)
  const darkMode = theme === "dark"

  useEffect(() => {
    if(theme){
      console.log('theme:', theme)
      setMode(theme === 'dark' ? 'dark' : 'light')
    }
  }, [ darkMode, theme, setMode, mode]);
  
  return (
    <>
      {children}
    </>
  );
};

export default MyThemeProvider;
