import { createUnixTimeFromKeepaTime } from "@/components/KeepaGraph";
import { BSR, CategoryTree } from "@/types/Product";
import { fromUnixTime } from "date-fns";

export const parseSalesRank = (
  salesRanks: { [key: string]: number[] },
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
    const rank =
      value[value.length - 1] != -1
        ? value[value.length - 1]
        : value[value.length - 3];
    bsr.number = rank;
    bsr.category = categoryName.name;
    bsr.createdAt = fromUnixTime(
      createUnixTimeFromKeepaTime(value[value.length - 2])
    ).toISOString();
    parsedSalesRank.push(bsr);
  });
  return parsedSalesRank;
};