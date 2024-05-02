"use client";

import { redirect } from "next/navigation";
import { createWebClient } from "@/web/appwrite";

export async function logoutAction() {
  const { account } = await createWebClient();
  await account.deleteSession("current");

  redirect("/app/auth/signin");
}
