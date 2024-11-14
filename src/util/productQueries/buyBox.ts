export function buyBoxFields(buyBox: string, findQuery: any[], isAmazon: boolean) {
  if (buyBox === "amazon") {
    findQuery.push({
      buyBoxIsAmazon: true,
    });
  }
  if (buyBox === "seller") {
    findQuery.push({
      $or: [
        {
          buyBoxIsAmazon: null,
        },
        { buyBoxIsAmazon: false },
      ],
    });
  }
  if (buyBox === "both") {
    findQuery.push({
      $or: [
        { buyBoxIsAmazon: true },
        { buyBoxIsAmazon: false },
        { buyBoxIsAmazon: null },
      ],
    });
  }
}
