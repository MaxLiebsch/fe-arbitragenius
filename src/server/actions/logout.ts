"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  if (
    cookies().has(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
    )
  )
    cookies().delete(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
    );

  redirect("/auth/signin");
}
