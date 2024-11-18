import { SALES_COL } from "@/constant/constant";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFields } from "@/util/productQueries/aznFields";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { marginFields } from "@/util/productQueries/marginFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("target") || "a";

  const isAmazon = target === "a";

  const customerSettings: Settings = settingsFromSearchQuery(searchParams);
  let { minMargin, minPercentageMargin, netto } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

  const targetFields = isAmazon
    ? aznFields(customerSettings, SALES_COL)
    : ebyFields(customerSettings, SALES_COL);

  aggregation.push(...targetFields);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  aggregation[0].$match = {
    ...targetFields[0].$match,
    ...marginFields({ target, settings: customerSettings }),
  };

  aggregation.push(
    {
      $facet: {
        totalProducts: [
          {
            $match: {
              ...targetFields[0].$match,
              ...marginFields({ target, settings: customerSettings }),
            },
          },
          { $count: "count" },
        ],
        totalProductsToday: [
          {
            $match: {
              ...targetFields[0].$match,
              ...marginFields({ target, settings: customerSettings }),
              createdAt: {
                $gte: today.toISOString(),
                $lt: tomorrow.toISOString(),
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        productCount: {
          $arrayElemAt: ["$totalProducts.count", 0],
        },
        totalProductsToday: { $arrayElemAt: ["$totalProductsToday.count", 0] },
      },
    }
  );

  const productCol = await getProductCol();

  const res = await productCol.aggregate(aggregation).toArray();


  return Response.json(
    res.length && res[0]?.productCount
      ? res[0]
      : { productCount: 0, todayCount: 0 }
  );
}
