"use server";
import { Models } from "appwrite";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import type { NextRequest, NextResponse } from "next/server";

export type AppwriteServerConfiguration = {
  url: string;
  projectId: string;
  key: string;
};

export type AppwriteNextHandlerResult =
  | Response
  | NextResponse
  | Promise<NextResponse>
  | Promise<Response>;

export type AppwriteNextMiddlewareHandler<
  Preferences extends Models.Preferences
> = (
  request: NextRequest & {
    user?: Models.User<Preferences>;
  }
) => Response | NextResponse | Promise<NextResponse> | Promise<Response>;

export type AppwriteNextMiddleware<Preferences extends Models.Preferences> = (
  handler: AppwriteNextMiddlewareHandler<Preferences>
) => AppwriteNextMiddlewareHandler<Preferences>;

export function authMiddleware<Preferences extends Models.Preferences>(
  handler: AppwriteNextMiddlewareHandler<Preferences>
): AppwriteNextMiddlewareHandler<Preferences> {
  return async (request) => {
    const cookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy`;
    const token = request.cookies.get(cookieName)?.value;

    if (!token) {
      return handler(request);
    }

    try {
      const account = await getUser<Preferences>(request.cookies);

      request.user = account || undefined;

      return handler(request);
    } catch (error) {
      console.error(error);

      return handler(request);
    }
  };
}

async function getUser<Preferences extends Models.Preferences>(
  cookies: RequestCookies | ReadonlyRequestCookies
) {
  try {
    const cookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy`;
    const token = cookies.get(cookieName)?.value ?? "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account`,
      {
        method: "GET",
        credentials: "include",
        // @ts-ignore
        headers: {
          Cookie: `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}_legacy=${token}`,
          "x-appwrite-project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
        },
        cache: "no-store",
      }
    );

    const json = (await response.json()) as any;

    if (json.code) {
      return null;
    }

    return json as Models.User<Preferences>;
  } catch (error) {
    return null;
  }
}
