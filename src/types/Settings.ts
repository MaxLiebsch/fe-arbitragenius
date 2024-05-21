import { z } from "zod";

export const SettingsSchema = z.object({
  netto: z.boolean(),
  minMargin: z.number(),
  minPercentageMargin: z.number(),
  maxSecondaryBsr: z.number(),
  maxPrimaryBsr: z.number(),
  productsWithNoBsr: z.boolean(),
  "a_vrfd.vrfn_pending": z.boolean().optional(),
  "e_vrfd.vrfn_pending": z.boolean().optional(), 
});

export type Settings = z.infer<typeof SettingsSchema>;
