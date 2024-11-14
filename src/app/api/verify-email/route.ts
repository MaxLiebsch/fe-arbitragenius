import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  if (!email) {
    return new Response("No email provided", {
      status: 400,
    });
  }

  const verifyEmail = await fetch(
    process.env.KICKBOX_URL +
      "/v2/verify?email=" +
      email +
      "&apikey=" +
      process.env.KICKBOX_API_KEY
  );
  return Response.json(await verifyEmail.json());
}
