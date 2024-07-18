import { Settings } from "@/types/Settings";

export const defaultProductFilterSettings: Settings = {
  minMargin: 0,
  minPercentageMargin: 0,
  tptSmall: 2.95,
  tptMiddle: 4.95,
  tptLarge: 6.95,
  strg: 0,
  tptStandard: 'tptMiddle',
  netto: true,
  maxSecondaryBsr: 1000000,
  maxPrimaryBsr: 1000000,
  productsWithNoBsr: true,
  monthlySold: 0,
  totalOfferCount: 0,
  buyBox: "both",
};
