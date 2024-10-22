import { PRODUCT_COL, SALES_COL } from "@/constant/constant";
import clientPool from "@/server/mongoPool";
import { BuyBox, Settings } from "@/types/Settings";
import { aznFlipMarginFields } from "@/util/productQueries/aznFlipMarginFields";
import { aznMarginFields } from "@/util/productQueries/aznMarginFields";
import { bsrAddFields } from "@/util/productQueries/bsrAddFields";
import { buyBoxFields } from "@/util/productQueries/buyBox";
import { ebyMarginFields } from "@/util/productQueries/ebyMarginFields";
import { marginFields } from "@/util/productQueries/marginFields";
import { monthlySoldField } from "@/util/productQueries/monthlySoldField";
import { primaryBsrExistsField } from "@/util/productQueries/primaryBsrExistsField";
import { productWithBsrFields } from "@/util/productQueries/productWithBsrFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { targetVerification } from "@/util/productQueries/targetVerfication";
import { totalOffersCountField } from "@/util/productQueries/totalOffersCountField";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const mongo = await clientPool["NEXT_MONGO"];
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("target") || "a";

  const isAmazon = target === "a";

  const customerSettings: Settings = settingsFromSearchQuery(searchParams);
  let {
    minMargin,
    minPercentageMargin,
    productsWithNoBsr,
    netto,
    monthlySold,
    totalOfferCount,
    buyBox,
  } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const targetVerificationPending = searchParams.get(
    `${target}_vrfd.vrfn_pending`
  );

  const aggregation: { [key: string]: any }[] = [];
  const findQuery: any[] = [];

  if (isAmazon) {
    aggregation.push(bsrAddFields);
    aggregation.push(...aznFlipMarginFields(customerSettings));
  } else {
    aggregation.push(...ebyMarginFields(customerSettings));
  }

  findQuery.push(marginFields({ target, settings: customerSettings }));
  targetVerification(findQuery, target, targetVerificationPending);

  if (isAmazon) {
    monthlySoldField(findQuery, monthlySold);
    totalOffersCountField(findQuery, totalOfferCount);
    buyBoxFields(buyBox, findQuery, isAmazon);
    productWithBsrFields(findQuery, customerSettings);
  }
  const pblshKey = isAmazon ? "a_pblsh" : "e_pblsh";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  aggregation.push(
    {
      $match: {
        [pblshKey]: true,
        $and: findQuery,
      },
    },
    { $count: "productCount" }
  );
  primaryBsrExistsField(aggregation, isAmazon, productsWithNoBsr);
  const productCol = mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(PRODUCT_COL);

  const res = await productCol.aggregate(aggregation).toArray();

  return Response.json(
    res.length && res[0]?.productCount
      ? res[0]
      : { productCount: 0, todayCount: 0 }
  );
}
