"use server";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "../appwrite";
import { z } from "zod";

const SignupRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(12),
});

export async function signupAction(formData: FormData) {
  const form = SignupRequestSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!form.success) return null;

  const { email, name, password } = form.data;

  const { account } = await createAdminClient();

  await account.create(ID.unique(), email, password, name);
  const session = await account.createEmailPasswordSession(email, password);

  cookies().set("arbispotter-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/dashboard");
}
