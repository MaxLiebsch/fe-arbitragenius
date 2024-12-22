import { redirect } from "next/navigation";
import { z } from "zod";
import { createWebClient } from "@/web/appwrite";
import { AppwriteException, ID } from "appwrite";
import { createEmailPasswordSession } from "@/server/actions/new-session";
import { createVerification } from "./send-verification";

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
    // const verifyEmail = await fetch("/app/api/verify-email?email=" + email);
    // if (verifyEmail) {
    //   const info = await verifyEmail.json();
    //   if (info.result === "risky") {
    //     return {
    //       message: "",
    //       formErrors: [],
    //       fieldErrors: {
    //         email: [
    //           "Die Email ist als riskant eingestuft. Bitte eine andere Email verwenden.",
    //         ],
    //       },
    //     };
    //   }
    //   if (info.result === "undeliverable") {
    //     return {
    //       message: "",
    //       formErrors: [],
    //       fieldErrors: {
    //         email: [
    //           "Die Email konnte nicht zugestellt werden. Bitte eine andere Email verwenden.",
    //         ],
    //       },
    //     };
    //   }
    //   if (info.disposable) {
    //     return {
    //       message: "",
    //       formErrors: [],
    //       fieldErrors: {
    //         email: [
    //           "Die Email ist als Wegwerf-Email eingestuft. Bitte eine andere Email verwenden.",
    //         ],
    //       },
    //     };
    //   }
    // }
    const { account } = await createWebClient();
    await account.create(ID.unique(), email, password, name);

    const response = await createEmailPasswordSession({ email, password });
    await createVerification(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/verify/callback/${email}`
    );
    const { message } = response;
    if (message !== "success") {
      return { message, formErrors: [], fieldErrors: {} };
    }
  } catch (error) {
    console.error("error:", error);
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
  redirect("/app/payment");
}
