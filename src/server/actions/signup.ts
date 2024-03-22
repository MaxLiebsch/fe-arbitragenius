"use server";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient, createSessionClient } from "../appwrite";
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

  const { account: acc } = await createSessionClient(session.secret);

  acc.createVerification(
    `${process.env.NEXT_PUBLIC_DOMAIN}/auth/verify/callback/${email}`
  );

  cookies().set(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy`,
    session.secret,
    {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    }
  );

  redirect("/payment");
}
