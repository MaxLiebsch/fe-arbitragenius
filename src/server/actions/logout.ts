"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  if (
    cookies().has(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy`
    )
  )
    cookies().delete(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy`
    );

  redirect("/auth/signin");
}
