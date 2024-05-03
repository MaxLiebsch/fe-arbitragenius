"use client";

import { createWebClient } from "@/web/appwrite";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const{ account} = await createWebClient() 
  await account.deleteSession("current");

  redirect("/auth/signin");
}
