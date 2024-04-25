import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          "50": "#ecfffd",
          "100": "#d0fdfb",
          "200": "#a7faf7",
          "300": "#6af6f3",
          "400": "#26eae9",
          "500": "#0aced0",
          "600": "#0ba6af",
          "700": "#11848d",
          "800": "#176a73",
          "900": "#185761",
          "950": "#0b4650",
        },
        primary: {
          "50": "#ffffe4",
          "100": "#fdffc4",
          "200": "#faff90",
          "300": "#f1ff50",
          "400": "#e6ff2b",
          "500": "#c5e600",
          "600": "#99b800",
          "700": "#738b00",
          "800": "#5b6d07",
          "900": "#4c5c0b",
          "950": "#283400",
        },
        "chartreuse-yellow": {
          "50": "#ffffe4",
          "100": "#fdffc4",
          "200": "#faff90",
          "300": "#f1ff50",
          "400": "#e6ff2b",
          "500": "#c5e600",
          "600": "#99b800",
          "700": "#738b00",
          "800": "#5b6d07",
          "900": "#4c5c0b",
          "950": "#283400",
        },
        "silver-chalice": {
          "50": "#f7f7f7",
          "100": "#ededed",
          "200": "#dfdfdf",
          "300": "#c8c8c8",
          "400": "#a6a6a6",
          "500": "#999999",
          "600": "#888888",
          "700": "#7b7b7b",
          "800": "#676767",
          "900": "#545454",
          "950": "#363636",
        },
        "sherpa-blue": {
          "50": "#ecfffd",
          "100": "#d0fdfb",
          "200": "#a7faf7",
          "300": "#6af6f3",
          "400": "#26eae9",
          "500": "#0aced0",
          "600": "#0ba6af",
          "700": "#11848d",
          "800": "#176a73",
          "900": "#185761",
          "950": "#0b4650",
        },
        amazon: "#FAE3C0",
        ebay: "#D6EEFC"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')({ prefix: 'ui' }),
    require('@tailwindcss/forms')
  ],
};
export default config;
