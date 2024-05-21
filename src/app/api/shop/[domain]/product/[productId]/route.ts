import { getLoggedInUser } from "@/server/appwrite";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { domain: string; productId: string } }
) {
  const user = await getLoggedInUser();
  if (!user?.labels.includes("admin")) {
    return Response.json("unauthorized", { status: 401 });
  }

  const { domain, productId } = params;
  const client = await new MongoClient(
    process.env.NEXT_MONGO_ADMIN ?? ""
  ).connect();

  const body = await request.json()

  const res = await client
  .db(process.env.NEXT_MONGO_DB)
  .collection(domain)
  .updateOne(
    { _id: new ObjectId(productId) },
    {
      $set: {
        ...body,
      },
    }
  );

  return Response.json(res);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { domain: string; productId: string } }
){
  const user = await getLoggedInUser();
  if (!user?.labels.includes("admin")) {
    return Response.json("unauthorized", { status: 401 });
  }

  const { domain, productId } = params;
  const client = await new MongoClient(
    process.env.NEXT_MONGO_ADMIN ?? ""
  ).connect();


  const res = await client
  .db(process.env.NEXT_MONGO_DB)
  .collection(domain)
  .deleteOne(
    { _id: new ObjectId(productId) },
  );

  return Response.json(res);

}
