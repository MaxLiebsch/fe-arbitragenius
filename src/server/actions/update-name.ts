"use server";

import { createSessionClient } from "../appwrite";
import { z } from "zod";
import { AppwriteException } from "node-appwrite";
import { updateCustomerInformation } from "../stripe/middleware";
import { getSubscriptions } from "../appwrite/getSubscription";

const changePasswordSchema = z.object({
  name: z.string(),
});

interface UpdatePasswordState {
  message?: string;
  error?: string;
}

export async function updateNameAction(
  prevState: UpdatePasswordState | null,
  formData: FormData
): Promise<UpdatePasswordState> {
  const form = changePasswordSchema.safeParse({
    name: formData.get("name"),
  });

  if (!form.success) return { error: "Ungültige Anmeldedaten" };

  const { name } = form.data;
  const { account } = await createSessionClient();

  try {
    const user = await account.get();
    if (user.$id) {
      const subscription = await getSubscriptions(user.$id);
      if (subscription.documents[0].customer) {
        await updateCustomerInformation(subscription.documents[0].customer, {
          name,
        });
      }
    }
    await account.updateName(name);
    return { message: "Name geändert" };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      throw error;
    }
  }
}
