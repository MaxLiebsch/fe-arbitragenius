import { mongoPromise } from "@/server/mongo";
import { BuyBox, Settings } from "@/types/Settings";
import { min } from "date-fns";
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
    netto: searchParams.get("netto") === "true",
    monthlySold: searchParams.get("monthlySold")
      ? Number(searchParams.get("monthlySold"))
      : 0,
    totalOfferCount: searchParams.get("totalOfferCount")
      ? Number(searchParams.get("totalOfferCount"))
      : 0,
    buyBox: (searchParams.get("buyBox") as BuyBox) || "both",
  };

  let {
    minMargin,
    minPercentageMargin,
    maxPrimaryBsr,
    maxSecondaryBsr,
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

  findQuery.push({
    $and: [
      { [`${target}_prc`]: { $gt: 0 } },
      { [`${target}_mrgn`]: { $gt: minMargin } },
      { [`${target}_mrgn_pct`]: { $gt: minPercentageMargin, $lte: 150 } },
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

    if (buyBox === "amazon") {
      findQuery.push({
        buyBoxIsAmazon: true,
      });
    }
    if (buyBox === "seller") {
      findQuery.push({
        buyBoxIsAmazon: null,
      });
    }

    if (buyBox === "both") {
      findQuery.push({
        $or: [{ buyBoxIsAmazon: true }, { buyBoxIsAmazon: null }],
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
  const pblshKey = isAmazon ? "a_pblsh" : "e_pblsh";
  aggregation.push(
    {
      $match: {
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

  

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(domain)
    .aggregate(aggregation)
    .toArray();

  return Response.json(res.length ? res[0] : { productCount: 0 });
}
