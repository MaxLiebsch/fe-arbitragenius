import { mongoPromise } from "@/server/mongo";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const mongo = await mongoPromise;

  const { target, domain } = params;
  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(domain)
    .countDocuments({
      $and: [
        { [`${target}_prc`]: { $gt: 0 } },
        { [`${target}_mrgn_pct`]: { $gt: 0, $lte: 150 } },
      ],
    });

  return Response.json(res);
}
