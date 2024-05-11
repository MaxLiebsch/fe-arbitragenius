import { mongoPromise } from "@/server/mongo";
import { SortDirection } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const { domain, target } = params;

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

  const mongo = await mongoPromise;

  const sort: {
    [key: string]: SortDirection;
  } = query.field ? { [query.field]: query.order === "asc" ? 1 : -1 } : {};

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(domain)
    .find({
      $and: findQuery,
    })
    .sort(sort)
    .skip(query.page * query.size)
    .limit(query.size)
    .toArray();

  return Response.json(res);
}
