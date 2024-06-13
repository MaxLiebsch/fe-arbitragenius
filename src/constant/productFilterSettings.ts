import { Settings } from "@/types/Settings";

export const defaultProductFilterSettings: Settings = {
  minMargin: 0,
  minPercentageMargin: 0,
  netto: true,
  maxSecondaryBsr: 1000000,
  maxPrimaryBsr: 1000000,
  productsWithNoBsr: true,
  monthlySold: 0,
  totalOfferCount: 0,
  buyBox: "both"
}