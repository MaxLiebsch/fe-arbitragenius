import { Settings } from "@/types/Settings";

export function addProductWithBsrFields(
  findQuery: any[],
  customerSettings: Settings
) {
  const { productsWithNoBsr, maxPrimaryBsr } = customerSettings;
  if (productsWithNoBsr) {
    findQuery.push({
      $or: [{ bsr: { $size: 0 } }, { "bsr.number": {$gt: 0, $lte: maxPrimaryBsr } }],
    });
  } else {
    findQuery.push({
      $and: [
        {
          bsr: { $size: 1 },
        },
        { "bsr.number": { $gt: 0, $lte: maxPrimaryBsr } },
      ],
    });
  }
}
