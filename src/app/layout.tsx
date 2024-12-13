import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import MuiXLicense from "../components/MuiXLicense";
import Script from "next/script";
import QueryClientProviderWrapper from "@/components/provider/QueryClientProviderWrapper";
const sharp = require("sharp");
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Arbispotter",
    default: "Arbispotter - Move Fast, Earn Easy",
  },
  description: "Wir machen Product Sourcing schnell, einfach und intelligent."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
      suppressHydrationWarning
        className={`${inter.className} h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
          <AntdRegistry>
            <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
          </AntdRegistry>
        </ThemeProvider>
        <MuiXLicense />
       <Analytics mode='auto'/> 
      </body>
    </html>
  );
}
