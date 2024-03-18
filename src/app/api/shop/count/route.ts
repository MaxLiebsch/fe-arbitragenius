import { mongoPromise } from "@/server/mongo";

export async function GET() {
  const mongo = await mongoPromise;

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .countDocuments({
      active: { $eq: true },
    });

  return Response.json(res);
}
