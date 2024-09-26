import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import MuiXLicense from "../components/MuiXLicense";
import Script from "next/script";
import QueryClientProviderWrapper from "@/components/provider/QueryClientProviderWrapper";
const sharp = require("sharp");

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
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} h-screen`}
      >
        <AntdRegistry>
          <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        </AntdRegistry>
        <MuiXLicense />
        <Script id="chatwood">
          {`
      (function(d,t) {
        var BASE_URL="https://app.chatwoot.com";
        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=BASE_URL+"/packs/js/sdk.js";
        g.defer = true;
        g.async = true;
        s.parentNode.insertBefore(g,s);
        g.onload=function(){
          window.chatwootSettings = {
  hideMessageBubble: false,
  position: 'left', // This can be left or right
  locale: 'de', // Language to be set
  type: 'standard', // [standard, expanded_bubble]
};
          window.chatwootSDK.run({
            websiteToken: 'VEsfYg2xaejGmiArkzgJpvPq',
            baseUrl: BASE_URL,
          });
        }
      })(document,"script");
       `}
        </Script>
      </body>
    </html>
  );
}
