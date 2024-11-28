import { Settings } from "@/types/Settings";
import { DEFAULT_MAX_BSR } from "./constant";



export const defaultSettings: Settings = {
  loaded: false,
  minMargin: 0,
  minPercentageMargin: 0,
  targetPlatforms: ["azn"],
  euProgram: true,
  fba: true,
  a_cats: [0],
  a_strg: 0,
  a_tptStandard: "a_tptMiddle",
  a_tptSmall: 2.95,
  a_tptMiddle: 4.95,
  a_tptLarge: 6.95,
  a_prepCenter: 0,
  e_prepCenter: 0,
  tptSmall: 2.95,
  tptMiddle: 4.95,
  tptLarge: 6.95,
  e_cats: [0],
  strg: 0,
  tptStandard: "tptMiddle",
  netto: true,
  maxPrimaryBsr: DEFAULT_MAX_BSR,
  productsWithNoBsr: false,
  monthlySold: 0,
  totalOfferCount: 0,
  buyBox: "both",
};
