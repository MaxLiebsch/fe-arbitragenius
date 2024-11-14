
import { z } from "zod";

export const ProductUpdateSchema = z.object({
  //Source
  eanCorrect: z.boolean(),
  sourceOutdated: z.boolean(),
  qty: z.number(),
  originalQty: z.number(),
  //Amazon
  a_qty: z.number(),
  originalAQty: z.number(),
  aTargetCorrect: z.boolean(),
  asin: z.string(),
  originalAsin: z.string(),
  //Ebay
  e_qty: z.number(),
  eTargetCorrect: z.boolean(),
  originalEQty: z.number(),
  esin: z.string(),
  originalEsin: z.string(),
});

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
