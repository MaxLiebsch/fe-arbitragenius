import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFields } from "@/util/productQueries/aznFields";
import { addBuyBoxFields } from "@/util/productQueries/buyBox";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { marginFields } from "@/util/productQueries/marginFields";
import { addMonthlySoldField } from "@/util/productQueries/monthlySoldField";
import { addProductWithBsrFields } from "@/util/productQueries/productWithBsrFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { addTotalOffersCountField } from "@/util/productQueries/totalOffersCountField";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const { target, domain } = params;
  const searchParams = request.nextUrl.searchParams;

  const isAmazon = target === "a";
  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

  let {
    minMargin,
    minPercentageMargin,
    netto,
    monthlySold,
    totalOfferCount,
    buyBox,
  } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }



  const aggregation: { [key: string]: any }[] = [];

  if (isAmazon) {
    aggregation.push(...aznFields(customerSettings, domain));
  } else {
    aggregation.push(...ebyFields(customerSettings, domain));
  }

  aggregation.push(
    {
      $match: {
        ...marginFields({ target, settings: customerSettings })
      },
    },
    { $count: "productCount" }
  );
  const productCol = await getProductCol();
  const res = await productCol.aggregate(aggregation).toArray();

  return Response.json(res.length ? res[0] : { productCount: 0 });
}
