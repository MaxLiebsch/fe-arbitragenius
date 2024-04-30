"use server";

import { cookies } from "next/headers";

export const setSession = async (secret: string) => {
  cookies().set(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`,
    secret,
    {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    }
  );
};
