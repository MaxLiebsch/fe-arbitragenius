export const addTotalOffersCountField = (
  findQuery: any[],
  totalOfferCount: number
) => {
  if (totalOfferCount > 0) {
    findQuery.push({
      totalOfferCount: { $lte: totalOfferCount },
    });
  }
};
