export const addTotalOffersCountField = (
  findQuery: any,
  totalOfferCount: number,
  target: string
) => {
  if (totalOfferCount > 0) {
    if (target === "a") {
      findQuery["totalOfferCount"] = { $lte: totalOfferCount };
    } else if (target === "e") {
      findQuery["e_totalOfferCount"] = { $lte: totalOfferCount };
    }
  }
};
