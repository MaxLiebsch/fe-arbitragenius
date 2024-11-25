import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
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
  const col = await getProductCol();
  const res = await col.countDocuments({
    taskIds: params.id,
  });

  return Response.json(res);
}
