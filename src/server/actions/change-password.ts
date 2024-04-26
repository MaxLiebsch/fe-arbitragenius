"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "../appwrite";
import { z } from "zod";
import { AppwriteException } from "node-appwrite";

const SigninRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  userId: z.string(),
  secret: z.string(),
  expire: z.string(),
});

export async function changePasswordAction(formData: FormData) {
  const form = SigninRequestSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    userId: formData.get("userId"),
    secret: formData.get("secret"),
    expire: formData.get("expire"),
  });

  if (!form.success) return null;

  const { email, password, userId, secret, expire } = form.data;
  const { account } = await createAdminClient();

  try {
    await account.updateRecovery(userId, secret, password);

    redirect("/auth/recovery/success");
  } catch (error) {
    if (error instanceof AppwriteException) {
      redirect(`/auth/recovery/error?email=${email}`);
    } else {
      throw error;
    }
  }
}
