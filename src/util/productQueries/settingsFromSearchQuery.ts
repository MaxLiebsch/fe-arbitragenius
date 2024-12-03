import { DEFAULT_MAX_BSR } from "@/constant/constant";
import { BuyBox, Settings } from "@/types/Settings";

export function settingsFromSearchQuery(searchParams: URLSearchParams) {
  const customerSettings: Settings = {
    minMargin: Number(searchParams.get("minMargin")) || 0,
    euProgram: searchParams.get("euProgram") === "true",
    fba: searchParams.get("fba") === "true",
    targetPlatforms: [],
    a_tptSmall: Number(searchParams.get("a_tptSmall")) || 0,
    a_tptMiddle: Number(searchParams.get("a_tptMiddle")) || 4.95,
    a_tptLarge: Number(searchParams.get("a_tptLarge")) || 6.95,
    a_strg: Number(searchParams.get("a_strg")) || 0,
    a_tptStandard: searchParams.get("a_tptStandard") || "a_tptMiddle",
    a_prepCenter: Number(searchParams.get("a_prepCenter")) || 0,
    a_cats: searchParams.getAll("a_cats")[0].split(",").map(Number),
    e_prepCenter: Number(searchParams.get("e_prepCenter")) || 0,
    e_cats: searchParams.getAll("e_cats")[0].split(',').map(Number),
    minPercentageMargin: Number(searchParams.get("minPercentageMargin")) || 0,
    maxPrimaryBsr: Number(searchParams.get("maxPrimaryBsr")) || DEFAULT_MAX_BSR,
    tptSmall: Number(searchParams.get("tptSmall")) || 0,
    tptMiddle: Number(searchParams.get("tptMiddle")) || 4.95,
    tptLarge: Number(searchParams.get("tptLarge")) || 6.95,
    strg: Number(searchParams.get("strg")) || 0,
    tptStandard: searchParams.get("tptStandard") || "tptMiddle",
    productsWithNoBsr: searchParams.get("productsWithNoBsr") === "true",
    netto: searchParams.get("netto") === "true",
    monthlySold: Number(searchParams.get("monthlySold")) || 0,
    totalOfferCount: Number(searchParams.get("totalOfferCount")) || 0,
    buyBox: (searchParams.get("buyBox") as BuyBox) || "both",
  };
  return customerSettings;
}
