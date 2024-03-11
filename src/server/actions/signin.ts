"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "../appwrite";
import { z } from "zod";
import { AppwriteException } from "node-appwrite";

const SigninRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});

export async function signinAction(formData: FormData) {
  const form = SigninRequestSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!form.success) return null;

  const { email, password } = form.data;
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("arbispotter-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    redirect("/");
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 401) {
      redirect("/auth/signin?error=user_invalid_credentials");
    } else {
      throw error;
    }
  }
}
