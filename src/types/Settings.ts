import { z } from "zod";

export const SettingsSchema = z.object({
  netto: z.boolean(),
  minMargin: z.number(),
  minPercentageMargin: z.number(),
  maxSecondaryBsr: z.number(),
  maxPrimaryBsr: z.number(),
  productsWithNoBsr: z.boolean(),
});

export type Settings = z.infer<typeof SettingsSchema>;
