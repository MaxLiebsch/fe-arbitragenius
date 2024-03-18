import { mongoPromise } from "@/server/mongo";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = {
    page: Number(searchParams.get("page")) || 0,
    size: Number(searchParams.get("size")) || 10,
  };

  if (params.page < 0)
    return new Response("page must be at least 0", {
      status: 400,
    });

  if (params.size < 1)
    return new Response("size must be at least 1", {
      status: 400,
    });

  const mongo = await mongoPromise;

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .find()
    .filter({
      active: { $eq: true },
    })
    .skip(params.page * params.size)
    .limit(params.size)
    .toArray();

  return Response.json(res);
}
