"use server";

import { AppwriteException } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import { SettingsSchema } from "@/types/Settings";

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
  const form = SettingsSchema.safeParse({
    netto: parsedFormData.netto,
    minMargin: parseInt(parsedFormData.minMargin ?? "0"),
    minPercentageMargin: parseInt(parsedFormData.minPercentageMargin ?? "0"),
    maxSecondaryBsr: parseInt(parsedFormData.maxSecondaryBsr ?? "0"),
    maxPrimaryBsr: parseInt(parsedFormData.maxPrimaryBsr ?? "0"),
    productsWithNoBsr: parsedFormData.productsWithNoBsr,
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

  const { minMargin, minPercentageMargin, netto, productsWithNoBsr, maxPrimaryBsr, maxSecondaryBsr } = form.data;
  const { account } = await createSessionClient();
  const prefs = await account.getPrefs();

  try {
    await account.updatePrefs({
      ...prefs,
      settings: JSON.stringify({
        minMargin,
        minPercentageMargin,
        netto,
        productsWithNoBsr,
        maxPrimaryBsr,
        maxSecondaryBsr,
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
