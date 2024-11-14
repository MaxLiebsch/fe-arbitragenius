"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "../appwrite";
import { z } from "zod";
import logger from "@/util/logger";

const RecoveryRequestSchema = z.object({
  email: z.string().email({ message: "Keine valide Email" }),
});

export type RecoveryFormState = {
  message: string;
} & z.typeToFlattenedError<z.infer<typeof RecoveryRequestSchema>>;

export async function recoveryAction(
  prevState: RecoveryFormState | null,
  formData: FormData
): Promise<RecoveryFormState> {
  const form = RecoveryRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!form.success) {
    const errors = form.error.flatten();
    return {
      message: "",
      ...errors,
    };
  }

  const { email } = form.data;

  try {
    const { account } = await createAdminClient();
    await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/recovery/callback/${email}`
    );
  } catch (error) {
    logger.error(`Error creating recovery: ${error}`);
    return {
      message: "Etwas ist schief gelaufen ...",
      formErrors: [],
      fieldErrors: {},
    };
  }
  redirect("/auth/recovery?status=ok");
}
