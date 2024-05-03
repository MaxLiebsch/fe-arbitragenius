import { NextResponse } from "next/server";
import { authMiddleware, getSubscriptions } from "./server/appwrite/middleware";
import { getStripeSubscriptions } from "./server/stripe/middleware";

export const middleware = authMiddleware(async (request) => {
  const requestPathname = request.nextUrl.pathname;
  if (!request.user) {
    if (requestPathname.startsWith("/app/api")) {
      return new NextResponse("unauthorized", { status: 401 });
    } else {
      if (
        requestPathname === "/api/sessions/email" ||
        requestPathname.startsWith("/api/account/verification")
      ) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/app/auth/signin", request.url));
    }
  }
  
  if (
    requestPathname.startsWith("/api/account/verification")
  ) {
    return NextResponse.next();
  }

  const subscriptions = await getSubscriptions(request.user.$id);

  if (!subscriptions.total) {
    if (!requestPathname.startsWith("/payment"))
      return NextResponse.redirect(new URL("/app/payment", request.url));
    else return NextResponse.next();
  }

  const stripeSubscription = await getStripeSubscriptions(
    subscriptions.documents[0].customer
  );

  if (
    !stripeSubscription.data.length ||
    stripeSubscription.data[0].status !== "active"
  )
    if (!requestPathname.startsWith("/payment"))
      return NextResponse.redirect(new URL("/app/payment", request.url));
    else return NextResponse.next();

  return NextResponse.next();
});

export const config = {
  matcher:
    "/((?!auth|payment/result|static|_next/static|_next/image|favicon.ico).*)",
  missing: [
    { type: "header", key: "next-router-prefetch" },
    { type: "header", key: "purpose", value: "prefetch" },
  ],
};
