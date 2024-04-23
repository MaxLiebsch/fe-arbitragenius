"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppwriteException } from "node-appwrite";
import { z } from "zod";
import { createAdminClient } from "../appwrite";

const SigninRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SigninFormState = {
  message: string;
};

export async function signinAction(
  prevState: SigninFormState | null,
  formData: FormData
): Promise<SigninFormState> {
  // const cookieStore = cookies();
  // console.log('cookieStore:', cookieStore)
  // const form = SigninRequestSchema.safeParse({
  //   email: formData.get("email"),
  //   password: formData.get("password"),
  // });

  // if (!form.success) return { message: "Ungültige Anmeldedaten" };

  // const { email, password } = form.data;

  // try {
  //   const { account } = await createAdminClient();
  //   const session = await account.createEmailPasswordSession(email, password);

  //   cookieStore.set(
  //     `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy`,
  //     session.secret,
  //     {
  //       path: "/",
  //       httpOnly: true,
  //       sameSite: "strict",
  //       secure: true,
  //     }
  //   );
  // } catch (error) {
  //   console.error(error);

  //   if (error instanceof AppwriteException) {
  //     return { message: "Ungültige Anmeldedaten" };
  //   }

    return { message: "Etwas ist schief gelaufen ..." };
  // }

  redirect("/");
}
