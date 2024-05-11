import { mongoPromise } from "@/server/mongo";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const { target, domain } = params;
  const mongo = await mongoPromise;
  const searchParams = request.nextUrl.searchParams;

  const customerSettings = {
    minMargin: Number(searchParams.get("minMargin")) || 0,
    minPercentageMargin: Number(searchParams.get("minPercentageMargin")) || 0,
  };

  const { minMargin, minPercentageMargin } = customerSettings;

  const findQuery = [
    { [`${target}_prc`]: { $gt: 0 } },
    { [`${target}_mrgn_pct`]: { $gt: minPercentageMargin, $lte: 150 } },
  ];

  if (minMargin > 0) {
    findQuery.push({ [`${target}_mrgn`]: { $gt: minMargin } });
  }

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(domain)
    .countDocuments({
      $and: findQuery,
    });

  return Response.json(res);
}
