import { getLoggedInUser } from "@/server/appwrite";
import { mongoPromise } from "@/server/mongo";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  const user = await getLoggedInUser();

  if (!user)
    return new Response(undefined, {
      status: 401,
    });

  const mongo = await mongoPromise;

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .findOne({ d: { $eq: params.domain } });

  return Response.json(res);
}
