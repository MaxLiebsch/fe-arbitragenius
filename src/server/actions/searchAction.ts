"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import logger from "@/util/logger";

const RecoveryRequestSchema = z.object({
  search: z.string(),
});

export type SearchFormState = {
  message: string;
} & z.typeToFlattenedError<z.infer<typeof RecoveryRequestSchema>>;

export async function searchAction(
  prevState: SearchFormState | null,
  formData: FormData
): Promise<any> {
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

  const { search } = form.data;

  try {
    redirect("/dashboard/search?q=" + search);

  } catch (error) {
    logger.error(`Error creating recovery: ${error}`);
    return {
      message: "Etwas ist schief gelaufen ...",
      formErrors: [],
      fieldErrors: {},
    };
  }
}
