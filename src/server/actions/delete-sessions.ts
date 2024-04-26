"use server";

import { createSessionClient } from "../appwrite";
import { z } from "zod";
import { AppwriteException } from "node-appwrite";
import { redirect } from "next/navigation";

const deleteSessionsSchema = z.object({
  password: z.string(),
});

interface deleteSessionsState {
  message?: string;
  error?: string;
}

export async function deleteSessionsAction(
  prevState: deleteSessionsState | null,
  formData: FormData
): Promise<deleteSessionsState> {
  const form = deleteSessionsSchema.safeParse({
    password: formData.get("password"),
  });

  if (!form.success) return { error: "Ungültige Anmeldedaten" };

  const { password } = form.data;
  const { account } = await createSessionClient();

  try {
    await account.deleteSessions();
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      throw error;
    }
  }
  redirect("/");
}
