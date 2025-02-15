import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { decodeWeek } from "@/util/decodeWeek";
import { aznFields } from "@/util/productQueries/aznFields";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { lookupProductInvalid } from "@/util/productQueries/lookupProductInvalid";
import { lookupProductIrrelevant } from "@/util/productQueries/lookupProductIrrelevant";
import { lookupProductSeen } from "@/util/productQueries/lookupProductSeen";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const user = await getLoggedInUser();
  const { target, domain } = params;
  const searchParams = request.nextUrl.searchParams;

  const isAmazon = target === "a";
  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

  const week = decodeWeek(searchParams);

  if (!week) {
    return new Response("Invalid week", {
      status: 400,
    });
  }

  let { minMargin, minPercentageMargin, netto } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

  if (isAmazon) {
    aggregation.push(
      ...aznFields({
        settings: customerSettings,
        week,
        excludeShops: ["sales", "wholesale"],
      })
    );
  } else {
    aggregation.push(
      ...ebyFields({
        settings: customerSettings,
        week,
        excludeShops: ["sales", "wholesale"],
      })
    );
  }
  aggregation.push(
    ...lookupProductSeen(user, target),
    ...lookupProductInvalid(user, target),
    ...lookupProductIrrelevant(user, target)
  );
  aggregation.push({ $count: "productCount" });
  const productCol = await getProductCol();

  const res = await productCol.aggregate(aggregation).toArray();
  if (
    isAmazon &&
    domain === "idealo.de" &&
    process.env.NODE_ENV === "development"
  ) {
    console.log("AZNAGGPCOUNT", JSON.stringify(aggregation));
  }
  if (
    !isAmazon &&
    domain === "idealo.de" &&
    process.env.NODE_ENV === "development"
  ) {
    console.log("EBYAGGPCOUNT", JSON.stringify(aggregation));
  }
  return Response.json(res.length ? res[0] : { productCount: 0 });
}
