"use server";
import { redirect } from "next/navigation";
import { createAdminClient } from "../appwrite";
import { z } from "zod";
import { AppwriteException } from "node-appwrite";

const SigninRequestSchema = z.object({
  email: z.string().email(),
});

export async function recoveryAction(formData: FormData) {
  const form = SigninRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!form.success) return null;

  const { email } = form.data;
  const { account } = await createAdminClient();

  try {
    await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/recovery/callback/${email}`
    );

    redirect("/auth/recovery?status=ok");
  } catch (error) {
    if (error instanceof AppwriteException) {
      console.log(error);
      redirect("/auth/recovery?error=appwrite_exception");
    } else {
      throw error;
    }
  }
}
