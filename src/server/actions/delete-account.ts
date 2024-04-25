"use server";

import { createAdminClient, createSessionClient } from "../appwrite";
import { z } from "zod";
import { AppwriteException } from "node-appwrite";
import { redirect } from "next/navigation";

const deleteUserSchema = z.object({
  id: z.string(),
});

interface UpdatePasswordState {
  message?: string;
  error?: string;
}

export async function deleteAccountAction(
  prevState: UpdatePasswordState | null,
  formData: FormData
): Promise<UpdatePasswordState> {
  const form = deleteUserSchema.safeParse({
    id: formData.get("id"),
  });

  if (!form.success) return { error: "Fehlende Id" };

  const { users } = await createAdminClient();
  const { id } = form.data;

  try {
    await users.delete(id);
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      throw error;
    }
  }
  redirect("https://www.arbispotter.com");
}
