import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { BuyBox, Settings } from "@/types/Settings";
import { ObjectId, SortDirection } from "mongodb";
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

  const customerSettings: Settings = {
    minMargin: Number(searchParams.get("minMargin")) || 0,
    minPercentageMargin: Number(searchParams.get("minPercentageMargin")) || 0,
    maxPrimaryBsr: Number(searchParams.get("maxPrimaryBsr")) || 1000000,
    tptSmall: Number(searchParams.get("tptSmall")) || 2.95,
    tptMiddle: Number(searchParams.get("tptMiddle")) || 4.95,
    tptLarge: Number(searchParams.get("tptLarge")) || 6.95,
    strg: Number(searchParams.get("strg")) || 0,
    tptStandard: searchParams.get("tptStandard") || "tptMiddle",
    maxSecondaryBsr: Number(searchParams.get("maxSecondaryBsr")) || 1000000,
    productsWithNoBsr: searchParams.get("productsWithNoBsr") === "true",
    netto: searchParams.get("netto") === "true",
    monthlySold: Number(searchParams.get("monthlySold")) || 0,
    totalOfferCount: Number(searchParams.get("totalOfferCount")) || 0,
    buyBox: (searchParams.get("buyBox") as BuyBox) || "both",
  };

  const targetVerificationPending = searchParams.get(
    `${target}_vrfd.vrfn_pending`
  );

  let {
    minMargin,
    minPercentageMargin,
    maxPrimaryBsr,
    maxSecondaryBsr,
    productsWithNoBsr,
    netto,
    strg,
    tptStandard,
    monthlySold,
    totalOfferCount,
    buyBox,
  } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

  const findQuery: any[] = [];
  if (isAmazon) {
    aggregation.push({
      $addFields: {
        primaryBsr: {
          $cond: {
            if: { $size: "$bsr" },
            then: { $arrayElemAt: ["$bsr", 0] },
            else: null,
          },
        },
        secondaryBsr: {
          $cond: {
            if: { $size: "$bsr" },
            then: { $arrayElemAt: ["$bsr", 1] },
            else: null,
          },
        },
        thirdBsr: {
          $cond: {
            if: { $size: "$bsr" },
            then: { $arrayElemAt: ["$bsr", 2] },
            else: null,
          },
        },
      },
    });
  } else {
    aggregation.push(
      {
        $match: {
          e_pblsh: true,
          e_prc: { $gt: 0 },
          e_uprc: { $gt: 0 },
        },
      },
      {
        $addFields: {
          e_mrgn: {
            $round: [
              {
                $subtract: [
                  "$e_prc",
                  {
                    $add: [
                      {
                        $divide: [
                          {
                            $multiply: [
                              "$prc",
                              { $divide: ["$e_qty", "$qty"] },
                            ],
                          },
                          {
                            $add: [
                              1,
                              { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                            ],
                          },
                        ],
                      },
                      "$e_tax",
                      customerSettings[tptStandard as "tptSmall"],
                      strg,
                      "$e_costs",
                    ],
                  },
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $addFields: {
          e_mrgn_pct: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: ["$e_mrgn", "$e_prc"],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      }
    );
  }

  findQuery.push({
    $and: [
      { [`${target}_prc`]: { $gt: 0 } },
      { [`${target}_mrgn_pct`]: { $gt: minPercentageMargin, $lte: 150 } },
      { [`${target}_mrgn`]: { $gt: minMargin } },
    ],
  });

  if (targetVerificationPending) {
    findQuery.push({
      $and: [
        {
          [`${target}_vrfd.vrfn_pending`]: targetVerificationPending === "true",
        },
      ],
    });
  } else {
    findQuery.push({
      $or: [
        {
          $and: [
            {
              [`${target}_vrfd.vrfd`]: true,
            },
            {
              [`${target}_vrfd.vrfn_pending`]: false,
            },
          ],
        },
        {
          $and: [
            {
              [`${target}_vrfd.vrfd`]: false,
            },
            {
              [`${target}_vrfd.vrfn_pending`]: true,
            },
          ],
        },
        {
          [`${target}_vrfd.flag_cnt`]: { $lt: { $size: 3 } },
        },
      ],
    });
  }

  if (isAmazon) {
    if (buyBox === "amazon") {
      findQuery.push({
        buyBoxIsAmazon: true,
      });
    }
    if (buyBox === "seller") {
      findQuery.push({
        $or: [
          {
            buyBoxIsAmazon: null,
          },
          { buyBoxIsAmazon: false },
        ],
      });
    }

    if (buyBox === "both") {
      findQuery.push({
        $or: [
          { buyBoxIsAmazon: true },
          { buyBoxIsAmazon: false },
          { buyBoxIsAmazon: null },
        ],
      });
    }

    if (monthlySold > 0) {
      findQuery.push({
        monthlySold: { $gte: monthlySold },
      });
    }

    if (totalOfferCount > 0) {
      findQuery.push({
        totalOfferCount: { $lte: totalOfferCount },
      });
    }

    if (productsWithNoBsr) {
      findQuery.push(
        {
          $or: [
            { primaryBsr: { $eq: null } },
            { "primaryBsr.number": { $lte: maxPrimaryBsr } },
          ],
        },
        {
          $or: [
            { secondaryBsr: { $eq: null } },
            { "secondaryBsr.number": { $lte: maxSecondaryBsr } },
          ],
        }
      );
    } else {
      findQuery.push(
        {
          $expr: { $gt: [{ $size: "$bsr" }, 0] },
        },
        { "primaryBsr.number": { $lte: maxPrimaryBsr } },
        {
          $or: [
            { "secondaryBsr.number": { $exists: false } },
            { "secondaryBsr.number": { $lte: maxSecondaryBsr } },
          ],
        }
      );
    }
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
  const mongo = await clientPool['NEXT_MONGO'];
  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection("sales")
    .aggregate(aggregation)
    .toArray();

  return Response.json(res);
}
