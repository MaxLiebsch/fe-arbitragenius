import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const preferences = user.prefs as any;

  const domains =
    typeof preferences.favorites === "string"
      ? preferences.favorites.split(",")
      : [];

  const mongo = await clientPool["NEXT_MONGO"];

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .find()
    .filter({
      active: { $eq: true },
      d: { $in: domains },
    })
    .project({
      _id: 0,
      d: 1,
      ne: 1,
    })
    .toArray();

  return Response.json(res);
}
