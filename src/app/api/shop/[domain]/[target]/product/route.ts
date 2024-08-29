import { getLoggedInUser } from "@/server/appwrite";
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
  const { domain, target } = params;

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
    if (!fba) {
      aggregation.push(...aznMarginFields(customerSettings));
    }
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

  if (isAmazon) {
    if (query.field === "none") {
      sort["primaryBsrExists"] = -1;
      sort["primaryBsr.number"] = 1;
      sort["secondaryBsr.number"] = 1;
      sort["thirdBsr.number"] = 1;
      sort["a_mrgn_pct"] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  } else {
    if (query.field === "none") {
      sort["e_mrgn_pct"] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  }
  const pblshKey = isAmazon ? "a_pblsh" : "e_pblsh";
  aggregation.push(
    {
      $match: {
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
  aggregation.push(
    {
      $lookup: {
        from: "users",
        let: { productId: "$_id", target },
        pipeline: [
          { $match: { userId: user.$id } },
          { $unwind: "$bookmarks" },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$bookmarks.productId", "$$productId"] },
                  { $eq: ["$bookmarks.target", "$$target"] },
                ],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "isBookmarked",
      },
    },
    {
      $addFields: {
        isBookmarked: { $gt: [{ $size: "$isBookmarked" }, 0] },
      },
    }
  );
  const mongo = await clientPool["NEXT_MONGO"];
  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(domain)
    .aggregate(aggregation)
    .toArray();

  return Response.json(res);
}
