import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFields } from "@/util/productQueries/aznFields";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { lookupProductInvalid } from "@/util/productQueries/lookupProductInvalid";
import { lookupProductIrrelevant } from "@/util/productQueries/lookupProductIrrelevant";
import { lookupProductSeen } from "@/util/productQueries/lookupProductSeen";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const searchParams = request.nextUrl.searchParams;

  const target = searchParams.get("target") || "a";

  const isAmazon = target === "a";

  const search = searchParams.get("q");

  if (!search) {
    return new Response("search query is required", {
      status: 400,
    });
  }

  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

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
        search,
        excludeShops: [ "wholesale"],
      })
    );
  } else {
    aggregation.push(
      ...ebyFields({
        settings: customerSettings,
        search,
        excludeShops: [ "wholesale"],
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

  return Response.json(res.length ? res[0] : { productCount: 0 });
}
