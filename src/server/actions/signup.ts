"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppwriteException, ID } from "node-appwrite";
import { z } from "zod";
import { createAdminClient, createSessionClient } from "../appwrite";

const SignupRequestSchema = z.object({
  email: z.string().email({ message: "Keine valide Email" }),
  name: z.string().optional(),
  terms: z.string({ message: "Bitte den AGB's und dem Datenschutz zustimmen" }),
  password: z
    .string()
    .min(12, { message: "Das Passwort muss mindestens 12 Zeichen lang sein" }),
});

export type SignupFormState = {
  message: string;
} & z.typeToFlattenedError<z.infer<typeof SignupRequestSchema>>;

export async function signupAction(
  prevState: SignupFormState | null,
  formData: FormData
): Promise<SignupFormState> {
  const cookieStore = cookies();
  const form = SignupRequestSchema.safeParse({
    email: formData.get("email"),
    terms: formData.get("terms"),
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!form.success) {
    const errors = form.error.flatten();
    return { message: "", ...errors };
  }

  const { email, name, password } = form.data;

  try {
    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    const { account: acc } = await createSessionClient(session.secret);

    acc.createVerification(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/verify/callback/${email}`
    );

    if (session?.secret) {
      cookieStore.set(
        `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy`,
        session.secret,
        {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        }
      );
    } else {
      return {
        message: "Etwas ist schief gelaufen ...",
        formErrors: [],
        fieldErrors: {},
      };
    }
  } catch (error) {
    console.error(error);

    if (error instanceof AppwriteException) {
      if ((error as any).type === "user_already_exists")
        return {
          message: "",
          formErrors: [],
          fieldErrors: {
            email: ["Ein Benutzer mit dieser Email existiert bereits"],
          },
        };
    }

    return {
      message: "Etwas ist schief gelaufen ...",
      formErrors: [],
      fieldErrors: {},
    };
  }

  redirect("/payment");
}
