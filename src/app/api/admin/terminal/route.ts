import { getLoggedInUser } from "@/server/appwrite";

export async function GET() {
  const user = await getLoggedInUser();
  if (!user?.labels.includes("admin")) {
    return new Response("unauthorized", { status: 401 });
  }
  try {
    await fetch(process.env.NEXT_PUBLIC_COCKPIT_URL!, {
      method: "HEAD",
    });
  } catch (error) {
    console.error("error:", error);
    if (error instanceof TypeError) {
      if (error.message === "fetch failed") {
        return new Response("unauthorized", {
          status: 200,
        });
      } else {
        return new Response("unauthorized", {
          status: 200,
        });
      }
    }
  }

  const auth = await fetch(
    process.env.NEXT_PUBLIC_COCKPIT_URL + "/cockpit/login",
    {
      headers: {
        Authorization: `Basic ${btoa(
          `${process.env.COCKPIT_USERNAME}:${process.env.COCKPIT_PASSWORD}`
        )}`,
      },
    }
  );

  if (auth.ok) {
    let cookie = auth.headers.get("set-cookie");
    let localhostCookie = "";
    if (!cookie) {
      return new Response("unauthorized", { status: 200 });
    }
    localhostCookie = cookie.replace("Path=/;", "Path=/; Domain=localhost;");

    const headers = new Headers();
    headers.append("Set-Cookie", localhostCookie);

    return new Response("success", {
      status: 200,
      headers,
    });
  } else {
    return new Response("unauthorized", { status: 200 });
  }
}
