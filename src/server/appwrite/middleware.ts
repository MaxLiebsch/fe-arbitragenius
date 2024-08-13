"use server";
import { Models } from "appwrite";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import type { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "../constant";

const legacy = process.env.NODE_ENV === 'development' ? "_legacy": ""

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
): AppwriteNextMiddlewareHandler<Preferences>{
  return async (request) => {
    const token = request.cookies.get(sessionCookieName)?.value;

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
    const token = cookies.get(sessionCookieName)?.value ?? "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account`,
      {
        method: "GET",
        credentials: "include",
        // @ts-ignore
        headers: {
          Cookie: `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}${legacy}=${token}`,
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

function flatten(data: any, prefix = "") {
  let output = {} as any;

  for (const [key, value] of Object.entries(data)) {
    let finalKey = prefix ? prefix + "[" + key + "]" : key;

    if (Array.isArray(value)) {
      output = { ...output, ...flatten(value, finalKey) };
    } else {
      output[finalKey] = value;
    }
  }

  return output;
}

export async function getSubscriptions(
  userId: string
): Promise<
  Models.DocumentList<
    { userId: string; customer: string; subscription: string } & Models.Document
  >
> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_CUSTOMER_DB_ID}/collections/${process.env.NEXT_CUSTOMER_SUBSCRIPTION_ID}/documents`
  );

  url.search = new URLSearchParams(
    flatten({
      queries: [
        JSON.stringify({
          method: "equal",
          attribute: "userId",
          values: [userId],
        }),
      ],
    })
  ).toString();

  const response = await fetch(url.toString(), {
    method: "GET",
    // @ts-ignore
    headers: {
      "content-type": "application/json",
      "x-appwrite-project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
      "x-appwrite-key": process.env.NEXT_APPWRITE_KEY,
    },
    cache: "no-store",
  });

  if (response.ok) return response.json();
  else
    return {
      total: 0,
      documents: [],
    };
}
