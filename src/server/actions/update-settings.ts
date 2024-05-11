"use server";

import { ZodIssue, z } from "zod";
import { AppwriteException } from "node-appwrite";
import { createSessionClient } from "../appwrite";

const updateSettingsSchema = z.object({
  netto: z.boolean(),
  minMargin: z.number(),
  minPercentageMargin: z.number(),
});

interface FieldError {
  message: string;
}

interface FieldErrors {
  [field: string]: FieldError;
}

interface UpdateSettingsState {
  message?: string;
  fieldErrors: FieldErrors;
  error?: string;
}

export async function updateSettingsAction(
  prevState: UpdateSettingsState | null,
  formData: FormData
): Promise<UpdateSettingsState> {
  const parsedFormData = JSON.parse(JSON.stringify(formData));
  const form = updateSettingsSchema.safeParse({
    netto: parsedFormData.netto,
    minMargin: parsedFormData.minMargin,
    minPercentageMargin: parsedFormData.minPercentageMargin,
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

  const { minMargin, minPercentageMargin, netto } = form.data;
  const { account } = await createSessionClient();
  const prefs = await account.getPrefs();

  try {
    await account.updatePrefs({
      ...prefs,
      settings: JSON.stringify({
         minMargin, minPercentageMargin, netto
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
