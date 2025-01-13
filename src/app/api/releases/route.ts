import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";

export async function GET() {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const client = await clientPool["NEXT_MONGO"];

  const db = client.db("arbispotter");

  const collection = db.collection("releases");
  const query = {
    version: process.env.NEXT_PUBLIC_VERSION,
    env: process.env.ENVIRONMENT?.toLowerCase(),
  };
  const release = await collection.findOne(query);
  return new Response(JSON.stringify(release), { status: 200 });
}
