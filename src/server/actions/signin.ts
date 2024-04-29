
import { redirect } from "next/navigation";
import { AppwriteException } from "appwrite";
import { z } from "zod";
import { createWebClient } from "@/web/appwrite";

export const SigninRequestSchema = z.object({
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
  const form = SigninRequestSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!form.success) return { message: "Ungültige Anmeldedaten" };

  const { email, password } = form.data;

  try {
    const { account } = await createWebClient();
    await account.createEmailPasswordSession(email, password);

  } catch (error) {

    if (error instanceof AppwriteException) {
      return { message: "Ungültige Anmeldedaten" };
    }

    return { message: "Etwas ist schief gelaufen ..." };
  }

  return redirect("/");
}
