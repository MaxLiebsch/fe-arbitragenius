import { PRODUCT_COL, SALES_COL } from "@/constant/constant";
import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { BuyBox, Settings } from "@/types/Settings";
import { aznMarginFields } from "@/util/productQueries/aznMarginFields";
import { bsrAddFields } from "@/util/productQueries/bsrAddFields";
import { buyBoxFields } from "@/util/productQueries/buyBox";
import { ebyMarginFields } from "@/util/productQueries/ebyMarginFields";
import { lookupUserId } from "@/util/productQueries/lookupUserId";
import { marginFields } from "@/util/productQueries/marginFields";
import { monthlySoldField } from "@/util/productQueries/monthlySoldField";
import { primaryBsrExistsField } from "@/util/productQueries/primaryBsrExistsField";
import { productWithBsrFields } from "@/util/productQueries/productWithBsrFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { sortingField } from "@/util/productQueries/sortingField";
import { targetVerification } from "@/util/productQueries/targetVerfication";
import { totalOffersCountField } from "@/util/productQueries/totalOffersCountField";
import { SortDirection } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const user = await getLoggedInUser();
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("target") || "a";

  const isAmazon = target === "a";

  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

  const targetVerificationPending = searchParams.get(
    `${target}_vrfd.vrfn_pending`
  );

  let {
    minMargin,
    minPercentageMargin,
    productsWithNoBsr,
    netto,
    monthlySold,
    euProgram,
    totalOfferCount,
    buyBox,
    fba,
  } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

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
    buyBoxFields(buyBox, findQuery, isAmazon);
    monthlySoldField(findQuery, monthlySold);
    totalOffersCountField(findQuery, totalOfferCount);
    productWithBsrFields(findQuery, customerSettings);
  }

  const query = {
    page: Number(searchParams.get("page")) || 0,
    size: Number(searchParams.get("size")) || 10,
    field: searchParams.get("sortby"),
    order: searchParams.get("sortorder"),
  };

  if (query.page < 0)
    return new Response("page must be at least 0", {
      status: 400,
    });

  if (query.size < 1)
    return new Response("size must be at least 1", {
      status: 400,
    });

  const sort: {
    [key: string]: SortDirection;
  } = {};
  sortingField(isAmazon, query, sort,euProgram);
  const pblshKey = isAmazon ? "a_pblsh" : "e_pblsh";
  aggregation.push(
    {
      $match: {
        sdmn: SALES_COL,
        [pblshKey]: true,
        $and: findQuery,
      },
    },
    {
      $sort: sort,
    },
    {
      $skip: query.page * query.size,
    },
    {
      $limit: query.size,
    }
  );
  primaryBsrExistsField(aggregation, isAmazon, productsWithNoBsr);
  
  lookupUserId(aggregation, user, target);
  const mongo = await clientPool["NEXT_MONGO"];
  const productCol = mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(PRODUCT_COL);
  const res = await productCol.aggregate(aggregation).toArray();

  return Response.json(res);
}
