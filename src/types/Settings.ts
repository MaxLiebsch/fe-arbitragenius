import { z } from "zod";

export const BuyBoxSchema = z.enum(["both", "amazon", "seller"]);

export type BuyBox = z.infer<typeof BuyBoxSchema>;

export const SettingsSchema = z.object({
  loaded: z.boolean().optional(),
  netto: z.boolean(),
  minMargin: z.number(),
  minPercentageMargin: z.number(),
  fba: z.boolean(),
  a_strg: z.number(),
  showSeen: z.boolean().optional(),
  a_cats: z.array(z.number()),
  a_tptStandard: z.string(),
  a_tptSmall: z.number(),
  a_tptMiddle: z.number(),
  a_tptLarge: z.number(),
  targetPlatforms: z.array(z.string()),
  euProgram: z.boolean(),
  a_prepCenter: z.number(),
  e_prepCenter: z.number(),
  e_cats: z.array(z.number()),
  maxPrimaryBsr: z.number(),
  productsWithNoBsr: z.boolean(),
  tptSmall: z.number(),
  tptMiddle: z.number(),
  tptLarge: z.number(),
  strg: z.number().optional(),
  tptStandard: z.string(),
  "a_vrfd.vrfn_pending": z.boolean().optional(),
  "e_vrfd.vrfn_pending": z.boolean().optional(),
  monthlySold: z.number(),
  totalOfferCount: z.number(),
  buyBox: BuyBoxSchema,
});

export type Settings = z.infer<typeof SettingsSchema>;
