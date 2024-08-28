import { Settings } from "@/types/Settings";

export function productWithBsrFields(
  findQuery: any[],
  customerSettings: Settings
) {
  const {productsWithNoBsr, maxPrimaryBsr, maxSecondaryBsr} = customerSettings;
  if (productsWithNoBsr) {
    findQuery.push(
      {
        $or: [
          { primaryBsr: { $eq: null } },
          { "primaryBsr.number": { $lte: maxPrimaryBsr } },
        ],
      },
      {
        $or: [
          { secondaryBsr: { $eq: null } },
          { "secondaryBsr.number": { $lte: maxSecondaryBsr } },
        ],
      }
    );
  } else {
    findQuery.push(
      {
        $expr: { $gt: [{ $size: "$bsr" }, 0] },
      },
      { "primaryBsr.number": { $lte: maxPrimaryBsr } },
      {
        $or: [
          { "secondaryBsr.number": { $exists: false } },
          { "secondaryBsr.number": { $lte: maxSecondaryBsr } },
        ],
      }
    );
  }
}
