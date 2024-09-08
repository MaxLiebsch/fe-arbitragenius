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
    bsr.number = rank;
    bsr.category = categoryName.name;
    bsr.createdAt = fromUnixTime(value[0][0]).toISOString();
    parsedSalesRank.push(bsr);
  });
  return parsedSalesRank;
};
