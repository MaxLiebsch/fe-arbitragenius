import { NextRequest } from "next/server";
import https from "https";
import axios from "axios";
import { SigninRequestSchema } from "@/server/actions/signin";

const DOMAIN_REGEX = /Domain=[^;]+/;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const form = SigninRequestSchema.safeParse({
    email: body.email,
    password: body.password,
  });

  if (!form.success)
    return new Response(
      JSON.stringify({
        message: "Ungültige Anmeldedaten",
        type: "AppwriteException",
      }),
      { status: 400 }
    );

  const requestHeaders: { [key: string]: string } = {};
  const xForwardedFor = request.headers.get("x-forwarded-for")
  const remoteAddress = (request as any)?.socket?.remoteAddress;
  const clientIp =
  xForwardedFor || // Use the first IP if behind a proxy
  remoteAddress; // Fallback to direct connection IP

  request.headers.forEach((value, key) => {
    requestHeaders[key] = value;
  });
  requestHeaders["x-forwarded-for"] = clientIp;

  const response = await axios.post(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT + "/account/sessions/email",
    body,
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      validateStatus: function (status) {
        return status <= 500; // Resolve only if the status code is 500 and less
      },
      headers: {
        ...requestHeaders,
        "Content-Type": "application/json",
        "X-Appwrite-Response-Format": "1.5.0",
        "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
      },
      
    }
  );

  const status = response.status;
  const data = response.data;

  let headers = response.headers;

  //@ts-ignore
  const rewrittenHeaders = new Headers(headers); // Clone headers to safely modify
  const setCookie = rewrittenHeaders.get("Set-Cookie");

  if (setCookie) {
    // Rewrite the domain in the Set-Cookie value
    let updatedSetCookie = setCookie;
    if (DOMAIN_REGEX.test(setCookie)) {
      updatedSetCookie = setCookie.replace(
        DOMAIN_REGEX,
        `Domain=.${process.env.DOMAIN}`
      );
    } else {
      updatedSetCookie = `${setCookie}; Domain=.${process.env.DOMAIN}`;
    }

    rewrittenHeaders.set("Set-Cookie", updatedSetCookie);
  }
  rewrittenHeaders.delete("content-length");
  
  return new Response(
    JSON.stringify({
      ...data,
      type: status > 201 ? "AppwriteException" : "Success",
    }),
    {
      status,
      //@ts-ignore
      headers: rewrittenHeaders,
    }
  );
}
