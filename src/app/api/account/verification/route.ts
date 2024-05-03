
import { NextRequest } from "next/server";

import axios from "axios";
import { z } from "zod";


export const VerificationSchema = z.object({
    url: z.string()
  });

export async function POST(request: NextRequest) {
  const body = await request.json();

  const form = VerificationSchema.safeParse({
    url: body.url,
  });

  if (!form.success)
    return new Response(
      JSON.stringify({
        message: "Ungültiger Body",
        type: "AppwriteException",
      }),
      { status: 400 }
    );

  const requestHeaders: { [key: string]: string } = {};
  request.headers.forEach((value, key) => {
    requestHeaders[key] = value;
  });
  const response = await axios.post(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT + "/account/verification",
    body,
    {
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
  delete headers["content-length"];

  return Response.json(
    {
      ...data,
      type: status > 201 ? "AppwriteException" : "Success",
    },
    {
      status,
      //@ts-ignore
      headers,
    }
  );
}
