"use server";

import { cookies } from "next/headers";
import { sessionCookieName } from "../constant";
export const setSession = async (secret: string) => {
  cookies().set(
    sessionCookieName,
    secret,
    {
      path: "/app",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    }
  );
};
