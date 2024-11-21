"use server";

import { AppwriteException } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import { Settings, SettingsSchema } from "@/types/Settings";

interface FieldError {
  message: string;
}

interface FieldErrors {
  [field: string]: FieldError;
}

interface UpdateSettingsState {
  message?: string;
  settings?: Settings;
  fieldErrors: FieldErrors;
  error?: string;
}

export async function updateSettingsAction(
  formData: FormData
): Promise<UpdateSettingsState> {
  const parsedFormData = JSON.parse(JSON.stringify(formData)); 
  const form = SettingsSchema.safeParse({
    netto: parsedFormData.netto ?? true,
    minMargin: parseInt(parsedFormData.minMargin || "0"),
    fba: parsedFormData.fba ?? true,
    targetPlatforms: parsedFormData.targetPlatforms,
    a_prepCenter: parseFloat(parsedFormData.a_prepCenter || "0"),
    a_tptSmall: parseFloat(parsedFormData.a_tptSmall || "2.95"),
    a_strg: parseFloat(parsedFormData.a_strg || "0"),
    a_tptMiddle: parseFloat(parsedFormData.a_tptMiddle || "4.95"),
    a_tptLarge: parseFloat(parsedFormData.a_tptLarge || "6.95"),
    a_tptStandard: parsedFormData.a_tptStandard || "a_tptMiddle",
    a_cats: parsedFormData.a_cats,
    euProgram: parsedFormData.euProgram,
    e_prepCenter: parseFloat(parsedFormData.e_prepCenter || "0"),
    e_cats: parsedFormData.e_cats,
    minPercentageMargin: parseInt(parsedFormData.minPercentageMargin || "0"),
    tptSmall: parseFloat(parsedFormData.tptSmall || "2.95"),
    tptMiddle: parseFloat(parsedFormData.tptMiddle || "4.95"),
    tptLarge: parseFloat(parsedFormData.tptLarge || "6.95"),
    tptStandard: parsedFormData.tptStandard || "tptMiddle",
    maxPrimaryBsr: parseInt(parsedFormData.maxPrimaryBsr || "0"),
    productsWithNoBsr: parsedFormData.productsWithNoBsr,
    monthlySold: parseInt(parsedFormData.monthlySold || "0"),
    totalOfferCount: parseInt(parsedFormData.totalOfferCount || "0"),
    buyBox: parsedFormData.buyBox,
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

  const { account } = await createSessionClient();
  const prefs = await account.getPrefs();

  if (parsedFormData.strg !== undefined) {
    form.data.strg = parseFloat(parsedFormData.strg);
  }
  try {
    await account.updatePrefs({
      ...prefs,
      settings: JSON.stringify(form.data),
    });
    return { message: "Filter geändert", fieldErrors: {}, settings: form.data };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message, fieldErrors: {} };
    } else {
      throw error;
    }
  }
}
