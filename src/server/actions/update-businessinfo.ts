"use server";

import { createSessionClient } from "../appwrite";
import { ZodIssue, z } from "zod";
import { AppwriteException } from "node-appwrite";
import { getSubscriptions } from "../appwrite/getSubscription";
import { updateCustomerInformation } from "../stripe/middleware";

const updateBusinessInfoSchema = z.object({
  business: z.string().min(10),
  vatin: z.string().min(1),
  street: z.string().min(1),
  houseNumber: z.string().min(1),
  code: z.string().min(4),
  city: z.string().min(3),
});

interface FieldError {
  message: string;
}

interface FieldErrors {
  [field: string]: FieldError;
}

interface UpdateBusinessInfoState {
  message?: string;
  fieldErrors: FieldErrors;
  error?: string;
}

export async function updateBusinessInfoAction(
  prevState: UpdateBusinessInfoState | null,
  formData: FormData
): Promise<UpdateBusinessInfoState> {
  const form = updateBusinessInfoSchema.safeParse({
    business: formData.get("business"),
    vatin: formData.get("vatin"),
    street: formData.get("street"),
    houseNumber: formData.get("houseNumber"),
    code: formData.get("code"),
    city: formData.get("city"),
  });

  if (!form.success)
    return {
      fieldErrors: form.error.errors.reduce((errorList, error) => {
        const { message } = error;
        const path = error.path[0] as string;
        errorList[path] = {
          message:
            message === "Expected string, received null"
              ? "wird benötigt"
              : message,
        };
        return errorList;
      }, {} as FieldErrors),
    };

  const { vatin, business, houseNumber, city, street, code } = form.data;
  const { account } = await createSessionClient();
  const prefs = await account.getPrefs();

  try {
    const user = await account.get();
    if (user.$id) {
      const subscription = await getSubscriptions(user.$id);
      if (subscription.documents[0].customer) {
        await updateCustomerInformation(subscription.documents[0].customer, { 
          address: {
            line1: business,
            city,
            country: "DE",
            line2: `${street} ${houseNumber}`,
            postal_code: code,
            state: "",
          },
        });
      }
    }
    await account.updatePrefs({
      ...prefs,
      address: JSON.stringify({
        business,
        vatin,
        street,
        houseNumber,
        code,
        city,
      }),
    });
    return { message: "Information geändert", fieldErrors: {} };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message, fieldErrors: {} };
    } else {
      throw error;
    }
  }
}
