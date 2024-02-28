import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import MuiXLicense from "./components/MuiXLicense";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arbitrage Genius",
  description: "Find the latest prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        
        <AntdRegistry>{children}</AntdRegistry>
        <MuiXLicense/>
      </body>
    </html>
  );
}
