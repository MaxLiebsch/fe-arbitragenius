import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFlipFields } from "@/util/productQueries/aznFlipFields";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { lookupProductInvalid } from "@/util/productQueries/lookupProductInvalid";
import { lookupProductIrrelevant } from "@/util/productQueries/lookupProductIrrelevant";
import { lookupProductSeen } from "@/util/productQueries/lookupProductSeen";
import {
  marginField,
  marginPctField,
} from "@/util/productQueries/marginFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("target") || "a";
  const isAmazon = target === "a";
  const lookupTarget = "flips";


  const customerSettings: Settings = settingsFromSearchQuery(searchParams);
  let { minMargin, minPercentageMargin, netto } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

  if (isAmazon) {
    aggregation.push(...aznFlipFields({ settings: customerSettings }));
  } else {
    aggregation.push(...ebyFields({ settings: customerSettings }));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  aggregation.push(
    ...lookupProductSeen(user, lookupTarget),
    ...lookupProductInvalid(user, lookupTarget),
    ...lookupProductIrrelevant(user, lookupTarget),
    {
      $match: {
        ...marginField({ target, settings: customerSettings }),
        ...(customerSettings.minPercentageMargin > 0 &&
          marginPctField({ target, settings: customerSettings })),
      },
    }, 
    { $count: "productCount" }
  );
  const productCol = await getProductCol();

  const res = await productCol.aggregate(aggregation).toArray();

  if (
    process.env.NODE_ENV === "development"
  ) {
    console.log("FLIPAGGPCOUNT", JSON.stringify(aggregation));
  }

  return Response.json(
    res.length && res[0]?.productCount
      ? res[0]
      : { productCount: 0, todayCount: 0 }
  );
}
