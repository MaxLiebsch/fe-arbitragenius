import { mongoPromise } from "@/server/mongo";
import { Settings } from "@/types/Settings";
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
  const mongo = await mongoPromise;
  const searchParams = request.nextUrl.searchParams;

  const isAmazon = target === "a";

  const customerSettings: Settings = {
    minMargin: Number(searchParams.get("minMargin")) || 0,
    minPercentageMargin: Number(searchParams.get("minPercentageMargin")) || 0,
    maxPrimaryBsr: Number(searchParams.get("maxPrimaryBsr")) || 1000000,
    maxSecondaryBsr: Number(searchParams.get("maxSecondaryBsr")) || 1000000,
    productsWithNoBsr: searchParams.get("productsWithNoBsr") === "true",
    netto: false,
  };

  const {
    minMargin,
    minPercentageMargin,
    maxPrimaryBsr,
    maxSecondaryBsr,
    productsWithNoBsr,
  } = customerSettings;

  const targetVerificationPending = searchParams.get(
    `${target}_vrfd.vrfn_pending`
  );

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
        primaryBsrExists: {
          $cond: {
            if: [{ $ne: ["$primaryBsr", null] }],
            then: true,
            else: false,
          },
        },
      },
    });
  }

  const findQuery: any[] = [
    { [`${target}_prc`]: { $gt: 0 } },
    { [`${target}_mrgn_pct`]: { $gt: minPercentageMargin, $lte: 150 } },
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
          [`${target}_vrfd.flag_cnt`]: {$lt: {$size:  3 }},
        },
      ],
    });
  }

  if (minMargin > 0) {
    findQuery.push({ [`${target}_mrgn`]: { $gt: minMargin } });
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
            { primaryBsr: { $eq: null } },
            { "secondaryBsr.number": { $lte: maxSecondaryBsr } },
          ],
        }
      );
    }
  }
  aggregation.push(
    {
      $match: {
        $and: findQuery,
      },
    },
    { $count: "productCount" }
  );

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(domain)
    .aggregate(aggregation)
    .toArray();

  return Response.json(res.length ? res[0] : { productCount: 0 });
}
