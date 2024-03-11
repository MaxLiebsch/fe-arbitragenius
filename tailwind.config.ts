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
          light: "#867ada", // TODO this light is no light at all
          DEFAULT: "#6751b3",
          dark: "#463b74",
        },
        primary: {
          light: "#34cdb1",
          DEFAULT: "#1ec5a9",
          dark: "#137264",
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
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
