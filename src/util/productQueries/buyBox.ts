export function addBuyBoxFields(buyBox: string, findQuery: object) {
  if (buyBox === "amazon") {
    Object.assign(findQuery,{
      buyBoxIsAmazon: true,
    });
  }
  if (buyBox === "seller") {
    Object.assign(findQuery,{
      $or: [
        {
          buyBoxIsAmazon: null,
        },
        { buyBoxIsAmazon: false },
      ],
    });
  }
  if (buyBox === "both") {
    Object.assign(findQuery,{
      $or: [
        { buyBoxIsAmazon: true },
        { buyBoxIsAmazon: false },
        { buyBoxIsAmazon: null },
      ],
    });
  }

  // buyBoxIsAmazon:{ $in: [true, false, null] }
}
