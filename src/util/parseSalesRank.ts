import { BSR, CategoryTree, SalesRanks } from "@/types/Product";
import { fromUnixTime } from "date-fns";

export const parseSalesRank = (
  salesRanks: SalesRanks,
  categoryTree: CategoryTree[]
) => {
  const parsedSalesRank: BSR[] = [];
  Object.entries(salesRanks).forEach(([key, value]) => {
    const bsr = {
      number: 0,
      category: "",
      createdAt: "",
    };
    const categoryName = categoryTree.find(
      (category) => category.catId === parseInt(key)
    );
    if (!categoryName) return;
    const rank = value[0][1];
    const date = value[0][0];

    bsr.number = rank || 10000000;
    bsr.category = categoryName.name;
    bsr.createdAt = date ?fromUnixTime(date).toISOString(): new Date().toISOString();
    parsedSalesRank.push(bsr);
  });
  return parsedSalesRank;
};
