import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import MuiXLicense from "../components/MuiXLicense";
import Providers from "../components/provider/Providers";
// const sharp = require('sharp')

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Arbispotter",
    default: "Arbispotter - Move Fast, Earn Easy",
  },
  description: "Wir machen Product Sourcing schnell, einfach und intelligent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body suppressHydrationWarning={true} className={`${inter.className} h-screen`}>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
        <MuiXLicense />
      </body>
    </html>
  );
}
