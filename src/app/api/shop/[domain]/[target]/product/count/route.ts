import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFields } from "@/util/productQueries/aznFields";
import { ebyFields } from "@/util/productQueries/ebyFields";
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

  let { minMargin, minPercentageMargin, netto } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

  if (isAmazon) {
    aggregation.push(...aznFields({settings:customerSettings, sdmn: domain}));
  } else {
    aggregation.push(...ebyFields({settings:customerSettings, sdmn: domain}));
  } 
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
