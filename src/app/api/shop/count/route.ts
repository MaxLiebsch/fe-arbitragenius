import clientPool from "@/server/mongoPool";

export async function GET() {
  const mongo = await clientPool['NEXT_MONGO'];

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB??"")
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .countDocuments({
      active: { $eq: true },
    });

  return Response.json(res);
}
