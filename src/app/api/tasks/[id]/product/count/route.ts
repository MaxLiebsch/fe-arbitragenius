import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getLoggedInUser();

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const mongo = await clientPool['NEXT_MONGO_ADMIN'];

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB ?? "")
    .collection(process.env.NEXT_MONGO_WHOLESALE ?? "wholesale")
    .countDocuments({
      taskIds: params.id,
    });

  return Response.json(res);
}
