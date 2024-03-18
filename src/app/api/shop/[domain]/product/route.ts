import { mongoPromise } from "@/server/mongo";
import { SortDirection } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  const searchParams = request.nextUrl.searchParams;
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
    .collection(params.domain)
    .find()
    .sort(sort)
    .skip(query.page * query.size)
    .limit(query.size)
    .toArray();

  return Response.json(res);
}
