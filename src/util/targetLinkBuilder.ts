import { ModifiedProduct } from "@/types/Product";

export const targetLinkBuilder = (target: string, product: any) => {
  if (target === "a" && product.asin) {
    return "https://www.amazon.de/dp/product/" + product.asin;
  }
  if (target === "e" && product.esin) {
    return "https://www.ebay.de/itm/" + product.esin;
  }

  return "";
};
