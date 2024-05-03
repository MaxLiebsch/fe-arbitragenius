import { createEmailPasswordSession } from "@/util/newSession";
import { AppwriteException } from "appwrite";
import { redirect } from "next/navigation";
import { z } from "zod";

export const SigninRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SigninRequest = z.infer<typeof SigninRequestSchema>;

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
  
  const response = await createEmailPasswordSession(form.data);
  const { message } = response;
  if (message === "success") {
    return redirect("/");
  } else {
    return { message };
  }
}
