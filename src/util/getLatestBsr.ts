import { BSR, ModifiedProduct } from "@/types/Product";
import { parseISO } from "date-fns";
import { parseSalesRank } from "./parseSalesRank";
import { aznCategoryMapping } from "@/constant/constant";

export const getLatestBsr = (
  product: ModifiedProduct
): {
  bsr: BSR[];
  aznCategory?: { label: string; value: number } | null;
} => {
  let { bsr, salesRanks, keepaUpdatedAt, categoryTree } = product;
  let aznCategory = null;
  if (bsr && bsr.length) {
    if (salesRanks) {
      const bsrLastUpdate = parseISO(bsr[0].createdAt).getTime();
      const salesRanksLastUpdate = keepaUpdatedAt
        ? parseISO(keepaUpdatedAt).getTime()
        : new Date().getTime();
      if (bsrLastUpdate < salesRanksLastUpdate && categoryTree) {
        bsr = parseSalesRank(salesRanks, categoryTree);
      }
    }
    if (categoryTree && categoryTree.length) {
      aznCategory = aznCategoryMapping.find(
        (cat) => cat.value === categoryTree[0].catId
      );
    }
  }
  return { bsr, aznCategory };
};
