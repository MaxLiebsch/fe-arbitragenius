import { getLoggedInUser } from "@/server/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getLoggedInUser();

  if (!user) redirect("/app/auth/signin");

  redirect("/dashboard");
}
