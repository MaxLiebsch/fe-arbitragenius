import { Settings } from "@/types/Settings";

export function productWithBsrFields(
  findQuery: any[],
  customerSettings: Settings
) {
  const { productsWithNoBsr, maxPrimaryBsr } = customerSettings;
  if (productsWithNoBsr) {
    findQuery.push({
      $or: [{ bsr: { $size: 0 } }, { "bsr.number": { $lte: maxPrimaryBsr } }],
    });
  } else {
    findQuery.push({
      $and: [
        {
          bsr: { $size: 1 },
        },
        { "bsr.number": { $lte: maxPrimaryBsr } },
      ],
    });
  }
}
