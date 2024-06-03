import { mongoPromise } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { SortDirection } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const { domain, target } = params;

  const isAmazon = target === "a";

  const customerSettings: Settings = {
    minMargin: Number(searchParams.get("minMargin")) || 0,
    minPercentageMargin: Number(searchParams.get("minPercentageMargin")) || 0,
    maxPrimaryBsr: Number(searchParams.get("maxPrimaryBsr")) || 1000000,
    maxSecondaryBsr: Number(searchParams.get("maxSecondaryBsr")) || 1000000,
    productsWithNoBsr: searchParams.get("productsWithNoBsr") === "true",
    netto: searchParams.get("netto") === "true",
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
  } = customerSettings;

  if(netto){
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

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
  }

  const findQuery: any[] = [
    {
      $and: [
        { [`${target}_prc`]: { $gt: 0 } },
        { [`${target}_mrgn_pct`]: { $gt: minPercentageMargin, $lte: 150 } },
        { [`${target}_mrgn`]: { $gt: minMargin } },
      ],
    },
  ];

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
    if (!productsWithNoBsr) {
      findQuery.push(
        {
          $expr: { $gt: [{ $size: "$bsr" }, 0] },
        },
        { "primaryBsr.number": { $lte: maxPrimaryBsr } },
        { "secondaryBsr.number": { $lte: maxSecondaryBsr } }
      );
    } else {
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
    if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  }

  aggregation.push(
    {
      $match: {
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
  const mongo = await mongoPromise;

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(domain)
    .aggregate(aggregation)
    .toArray();

  return Response.json(res);
}
