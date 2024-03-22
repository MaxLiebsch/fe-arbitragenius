import { NextResponse } from "next/server";
import { authMiddleware, getSubscriptions } from "./server/appwrite/middleware";
import { stripe } from "./server/stripe";
import { getStripeSubscriptions } from "./server/stripe/middleware";

export const middleware = authMiddleware(async (request) => {
  if (!request.user) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return new NextResponse("unauthorized", { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  const subscriptions = await getSubscriptions(request.user.$id);

  if (!subscriptions.total) {
    if (!request.nextUrl.pathname.startsWith("/payment"))
      return NextResponse.redirect(new URL("/payment", request.url));
    else return NextResponse.next();
  }

  const stripeSubscription = await getStripeSubscriptions(
    subscriptions.documents[0].customer
  );

  if (
    !stripeSubscription.data.length ||
    stripeSubscription.data[0].status !== "active"
  )
    if (!request.nextUrl.pathname.startsWith("/payment"))
      return NextResponse.redirect(new URL("/payment", request.url));
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
