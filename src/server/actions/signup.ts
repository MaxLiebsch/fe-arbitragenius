import { redirect } from "next/navigation";
import { z } from "zod";
import { createWebClient } from "@/web/appwrite";
import { AppwriteException, ID } from "appwrite";
import { createEmailPasswordSession } from "@/util/newSession";

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
    const { account } = await createWebClient();
    await account.create(ID.unique(), email, password, name);

    const response = await createEmailPasswordSession({ email, password });

    await account.createVerification(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/verify/callback/${email}`
    );
    const { message } = response;
    if (message !== "success") {
      return { message, formErrors: [], fieldErrors: {} };
    }
  } catch (error) {
    console.log("error:", error);
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
