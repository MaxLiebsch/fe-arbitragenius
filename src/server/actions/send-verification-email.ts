"use server";
import { redirect } from "next/navigation";
import { createSessionClient, getLoggedInUser } from "../appwrite";

export async function sendVerificationEmailAction() {
  const user = await getLoggedInUser();

  if (!user) redirect("/app/auth/signin");

  if (user.emailVerification) redirect("/app");

  const { account } = await createSessionClient();

  await account.createVerification(
    `${process.env.NEXT_PUBLIC_DOMAIN}/auth/verify/callback/${user.email}`
  );

  redirect("/auth/verify?status=ok");
}
