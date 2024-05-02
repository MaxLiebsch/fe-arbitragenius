import { AppwriteException } from "appwrite";
import { redirect } from "next/navigation";
import { z } from "zod";

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

  const res = await fetch("/app/api/sessions/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.status !== 201) {
    if (data.type === "AppwriteException") {
      return { message: "Ungültige Anmeldedaten" };
    }
    return { message: "Etwas ist schief gelaufen ..." };
  }else{
    return redirect("/");
  }

}
