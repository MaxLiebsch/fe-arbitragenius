import { Settings } from "@/types/Settings";

export const addAznSettingsFields = (settings: Settings, match: any) => {
  const { monthlySold, totalOfferCount, buyBox, productsWithNoBsr } = settings;
  if (monthlySold > 0) {
    match.$and.push({ monthlySold: { $gte: monthlySold } });
  }

  if (totalOfferCount > 0) {
    match.$and.push({ totalOfferCount: { $lte: totalOfferCount } });
  }

  switch (buyBox) {
    case "amazon":
      match.$and.push({ buyBoxIsAmazon: true });
      break;
    case "seller":
      match.$and.push({ buyBoxIsAmazon: { $in: [null, false] } });
      break;
    case "both":
      match.$and.push({ buyBoxIsAmazon: { $in: [true, false, null] } });
      break;
  }

  if (productsWithNoBsr) {
    match.$and.push({
      $or: [
        { bsr: { $size: 0 } },
        { "bsr.number": { $gt: 0, $lte: settings.maxPrimaryBsr } },
      ],
    });
  } else {
    match.$and.push(
      { "bsr.number": { $gt: 0, $lte: settings.maxPrimaryBsr } },
    );
  }
};
