import { NextRequest } from "next/server";
import https from 'https'
import axios from "axios";
import { SigninRequestSchema } from "@/server/actions/signin";

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
  request.headers.forEach((value, key) => {
    requestHeaders[key] = value;
  });
  const response = await axios.post(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT + "/account/sessions/email",
    body,
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
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
  console.log('data:', data)

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
