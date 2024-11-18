import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFlipFields } from "@/util/productQueries/aznFlipFields";
import { addBuyBoxFields } from "@/util/productQueries/buyBox";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { marginFields } from "@/util/productQueries/marginFields";
import { addMonthlySoldField } from "@/util/productQueries/monthlySoldField";
import { addProductWithBsrFields } from "@/util/productQueries/productWithBsrFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { addTotalOffersCountField } from "@/util/productQueries/totalOffersCountField";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("target") || "a";

  const isAmazon = target === "a";

  const customerSettings: Settings = settingsFromSearchQuery(searchParams);
  let {
    minMargin,
    minPercentageMargin,
    netto, 
  } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

  if (isAmazon) {
    aggregation.push(...aznFlipFields(customerSettings));
  } else {
    aggregation.push(...ebyFields(customerSettings));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  aggregation.push(
    {
      $match: {
        ...marginFields({ target, settings: customerSettings }),
      },
    },
    {
      $group: {
        _id: {
          field2: "$asin",
        },
        document: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$document" },
    },
    { $count: "productCount" }
  );
  const productCol = await getProductCol();

  const res = await productCol.aggregate(aggregation).toArray();

  return Response.json(
    res.length && res[0]?.productCount
      ? res[0]
      : { productCount: 0, todayCount: 0 }
  );
}
