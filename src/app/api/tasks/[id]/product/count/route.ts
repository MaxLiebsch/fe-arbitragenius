import { getLoggedInUser } from "@/server/appwrite";
import { mongoAdminPromise } from "@/server/mongo";
import { ObjectId } from "mongodb";
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

  const mongo = await mongoAdminPromise;

  const res = await mongo
    .db(process.env.NEXT_MONGO_CRAWLER_DATA ?? "")
    .collection(process.env.NEXT_MONGO_WHOLESALE ?? "wholesale")
    .countDocuments({
      taskId: params.id,
    });

  return Response.json(res);
}
