import { PRODUCT_COL } from "@/constant/constant";
import clientPool from "@/server/mongoPool";
import { BuyBox, Settings } from "@/types/Settings";
import { aznMarginFields } from "@/util/productQueries/aznMarginFields";
import { bsrAddFields } from "@/util/productQueries/bsrAddFields";
import { buyBoxFields } from "@/util/productQueries/buyBox";
import { ebyMarginFields } from "@/util/productQueries/ebyMarginFields";
import { marginFields } from "@/util/productQueries/marginFields";
import { monthlySoldField } from "@/util/productQueries/monthlySoldField";
import { productWithBsrFields } from "@/util/productQueries/productWithBsrFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { targetVerification } from "@/util/productQueries/targetVerfication";
import { totalOffersCountField } from "@/util/productQueries/totalOffersCountField";
import { NextRequest } from "next/server";

/*
    verified empty show
    verified [admin] not show
    verified [user1, user2, user3] not show

*/

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const { target, domain } = params;
  const mongo = await clientPool["NEXT_MONGO"];
  const searchParams = request.nextUrl.searchParams;

  const isAmazon = target === "a";
  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

  let {
    minMargin,
    minPercentageMargin,
    productsWithNoBsr,
    netto,
    monthlySold,
    fba,
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
    aggregation.push(...aznMarginFields(customerSettings));
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
  aggregation.push(
    {
      $match: {
        sdmn: domain,
        [pblshKey]: true,
        $and: findQuery,
      },
    },
    { $count: "productCount" }
  );

  if (isAmazon && productsWithNoBsr) {
    aggregation.splice(2, 0, {
      $addFields: {
        primaryBsrExists: {
          $cond: {
            if: { $ifNull: ["$primaryBsr", false] },
            then: true,
            else: false,
          },
        },
      },
    });
  }
  const productCol = mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(PRODUCT_COL);
  const res = await productCol.aggregate(aggregation).toArray();

  return Response.json(res.length ? res[0] : { productCount: 0 });
}
