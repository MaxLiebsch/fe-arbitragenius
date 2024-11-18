import { Settings } from "@/types/Settings";

export const addAznSettingsFields = (settings: Settings, match: object) => {
  const { monthlySold, totalOfferCount, buyBox, productsWithNoBsr } = settings;
  if (monthlySold > 0) {
    Object.assign(match, { monthlySold: { $gte: monthlySold } });
  }

  if (totalOfferCount > 0) {
    Object.assign(match, { totalOfferCount: { $lt: totalOfferCount } });
  }

  switch (buyBox) {
    case "amazon":
      Object.assign(match, { buyBoxIsAmazon: true });
      break;
    case "seller":
      Object.assign(match, { buyBoxIsAmazon: { $in: [null, false] } });
      break;
    case "both":
      Object.assign(match, { buyBoxIsAmazon: { $in: [true, false, null] } });
      break;
  }

  if (productsWithNoBsr) {
    Object.assign(match, {
      $or: [
        { bsr: { $size: 0 } },
        { "bsr.number": { $gt: 0, $lte: settings.maxPrimaryBsr } },
      ],
    });
  } else {
    Object.assign(match, {
      $and: [
        { bsr: { $size: 1 } },
        { "bsr.number": { $gt: 0, $lte: settings.maxPrimaryBsr } },
      ],
    });
  }
};
