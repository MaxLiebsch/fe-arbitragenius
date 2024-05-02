"use client";

import { redirect } from "next/navigation";
import { createSessionClient } from "../appwrite";

export async function logoutAction() {
  const { account } = await createSessionClient();
  await account.deleteSession("current");

  redirect("/auth/signin");
}
