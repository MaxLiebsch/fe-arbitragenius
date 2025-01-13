
export const targetLinkBuilder = (target: string, product: any) => {
  if (target === "a" && product.asin) {
    return "https://www.amazon.de/dp/product/" + product.asin;
  }
  if (target === "e" && product.eanList && product.eanList.length) {
    return `https://www.ebay.de/sch/i.html?_fsrp=1&rt=nc&_from=R40&LH_PrefLoc=3&LH_ItemCondition=3&_nkw=${product.eanList[0]}&_sacat=0&LH_BIN=1`;
  } else {
    return "https://www.ebay.de/itm/" + product.esin;
  }
};
