"use server";
import { redirect } from "next/navigation";
import { createSessionClient, getLoggedInUser } from "../appwrite";

export async function sendVerificationEmailAction() {
  const user = await getLoggedInUser();

  if (!user) redirect("/auth/signin");

  if (user.emailVerification) redirect("/");

  const { account } = await createSessionClient();

  account.createVerification(
    `${process.env.NEXT_PUBLIC_DOMAIN}/auth/verify/callback/${user.email}`
  );

  redirect("/auth/verify?status=ok");
}
