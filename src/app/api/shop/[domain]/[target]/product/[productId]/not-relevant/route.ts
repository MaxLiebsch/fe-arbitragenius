import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { Models } from "node-appwrite";

export async function GET(
  request: NextRequest & {
    user?: Models.User<Models.Preferences> | undefined;
  },
  { params }: { params: { domain: string; productId: string; target: string } }
) {
  const { productId, target } = params;
  const user = await getLoggedInUser();
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (!target || (target !== "a" && target !== "e" && target !== "k")) {
    return new Response("Invalid target", {
      status: 400,
    });
  }

  if (!ObjectId.isValid(productId)) {
    return new Response("Invalid productId", {
      status: 400,
    });
  }

  const client = await clientPool["NEXT_MONGO_ADMIN"];

  const col = client.db().collection("userIrrelevant");
  await col.updateOne(
    { userId: user.$id, productId: new ObjectId(productId), target },
    { $set: { irrelevantAt: new Date() } },
    { upsert: true }
  );

  return new Response("ok");
}
