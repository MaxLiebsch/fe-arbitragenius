"use server";

import { AppwriteException } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import { z } from "zod";
import { Settings } from "@/types/Settings";

interface FieldError {
  message: string;
}

interface FieldErrors {
  [field: string]: FieldError;
}

interface UpdateTargetPlatformsState {
  message?: string;
  targetPlatforms?: TargetPlatforms;
  fieldErrors: FieldErrors;
  error?: string;
}

const targetPlatformsSchema = z.object({
  targetPlatforms: z.array(z.string()),
});

type TargetPlatforms = z.infer<typeof targetPlatformsSchema>;

export async function updateTargetPlatformsAction(
  formData: FormData
): Promise<UpdateTargetPlatformsState> {
  const parsedFormData = JSON.parse(JSON.stringify(formData));
  const form = targetPlatformsSchema.safeParse({
    targetPlatforms: parsedFormData.targetPlatforms,
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
  const prefs = await account.getPrefs<{ settings?: string }>();
  try {
    const settings = prefs.settings;
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      const updatedSettings = {
        ...parsedSettings,
        targetPlatforms: form.data.targetPlatforms,
      };
      await account.updatePrefs({
        ...prefs,
        settings: JSON.stringify(updatedSettings),
      });
    } else {
      await account.updatePrefs({
        ...prefs,
        settings: JSON.stringify({
          targetPlatforms: form.data.targetPlatforms,
        }),
      });
    }
    return {
      message: "Einstellungen erfolgreich aktualisiert",
      fieldErrors: {},
      targetPlatforms: form.data,
    };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message, fieldErrors: {} };
    } else {
      throw error;
    }
  }
}
