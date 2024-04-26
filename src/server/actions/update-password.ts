"use server";

import { createAdminClient, createSessionClient } from "../appwrite";
import { z } from "zod";
import { AppwriteException } from "node-appwrite";

const changePasswordSchema = z.object({
  oldPassword: z.string(),
  password: z.string(),
});

interface UpdatePasswordState {
  message?: string;
  error?: string;
}

export async function updatePasswordAction(
  prevState: UpdatePasswordState | null,
  formData: FormData
): Promise<UpdatePasswordState> {
  const form = changePasswordSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    password: formData.get("password"),
  });

  if (!form.success) return { error: "Ungültige Anmeldedaten" };

  const { password, oldPassword } = form.data;
  const { account } = await createSessionClient();

  try {
    await account.updatePassword(password, oldPassword);
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      throw error;
    }
  }
  return { message: "Passwort geändert" };
}
