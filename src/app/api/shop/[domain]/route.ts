import clientPool from "@/server/mongoPool";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  const mongo = await clientPool["NEXT_MONGO"];

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB ?? "")
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .findOne({ d: { $eq: params.domain }, active: { $eq: true } });

  return Response.json(res);
}
