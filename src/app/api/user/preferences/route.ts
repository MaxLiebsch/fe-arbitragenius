import { getLoggedInUser } from "@/server/appwrite";

export async function GET() {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });
  return new Response(JSON.stringify(user.prefs));
}
