import axios from "axios";
import { NextRequest } from "next/server";
import https from 'https'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const requestHeaders: { [key: string]: string } = {};
  request.headers.forEach((value, key) => {
    requestHeaders[key] = value;
  });
  const response = await axios.delete(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT + `/account/sessions/${id}`,
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

  let headers = response.headers;
  delete headers["content-length"];

  return new Response(status===204?undefined: data,
    {
      status,
      //@ts-ignore
      headers,
    }
  );
}
