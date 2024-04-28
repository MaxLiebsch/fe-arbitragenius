import { getLoggedInUser } from "@/server/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getLoggedInUser();
  
  if (!user) redirect("/auth/signin");
   
  redirect('/dashboard')

}
