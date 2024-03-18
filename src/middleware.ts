import { NextResponse } from "next/server";
import { authMiddleware } from "./server/appwrite/middleware";

export const middleware = authMiddleware((request) => {
  if (!request.user) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return new NextResponse("unauthorized", { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: "/((?!auth|static|_next/static|_next/image|favicon.ico).*)",
  missing: [
    { type: "header", key: "next-router-prefetch" },
    { type: "header", key: "purpose", value: "prefetch" },
  ],
};
