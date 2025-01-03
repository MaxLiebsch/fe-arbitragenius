import { NextResponse } from "next/server";
import { authMiddleware } from "./server/appwrite/middleware";
import { getStripeSubscriptions } from "./server/stripe/middleware";
import { getSubscriptions } from "./server/appwrite/getSubscription";
import { Models } from "node-appwrite";
import Stripe from "stripe";
import { subscriptionCache } from "./server/cache/subscriptionCache";

const isVercel = process.env.VERCEL === "true";
const basepath = process.env.NODE_ENV === "development" ? "" : "/app";

function cleanPathname(pathname: string): string {
  // Look for the pattern after .app/ or just get everything after the last /app/
  const match =
    pathname.match(/\.app(\/.*$)/) || pathname.match(/\/app(\/.*$)/);
  if (match) {
    return match[1];
  }

  // Fallback: remove the hash-like prefix and HTTP method
  return pathname.replace(/^\/[a-f0-9]+\/[A-Z]+\/https?\/[^/]+/, "");
}

const isApiPath = (pathname: string) => pathname.startsWith(`${basepath}/api`);

const allowedPaths = (pathname: string): boolean => {
  return (
    pathname.startsWith(`${basepath}/api/sessions/email`) ||
    pathname.startsWith(`${basepath}/api/account/verification`) ||
    pathname.startsWith(`${basepath}/api/verify-email`)
  );
};

const isVerficationPath = (pathname: string) =>
  pathname.startsWith(`${basepath}/api/account/verification`);

const isSubscriptionPath = (pathname: string): boolean =>
  pathname.startsWith(`${basepath}/api/user/subscriptions`);

const isPlansPath = (pathname: string) =>
  pathname.startsWith(`${basepath}/api/plans`);

const isPaymentPath = (pathname: string) =>
  pathname.startsWith(`${basepath}/payment`) || pathname.startsWith("/payment");

export const middleware = authMiddleware(async (request) => {
  const pathname = isVercel
    ? cleanPathname(request.nextUrl.pathname)
    : request.nextUrl.pathname;

  if (!request.user) {
    if (allowedPaths(pathname)) {
      return NextResponse.next();
    }

    if (isApiPath(pathname)) {
      return new NextResponse("unauthorized", { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/app/auth/signin", request.url));
    }
  }

  if (isSubscriptionPath(pathname)) {
    return NextResponse.next();
  }

  if (isVerficationPath(pathname)) {
    return NextResponse.next();
  }

  if (isPlansPath(pathname)) {
    return NextResponse.next();
  }

  let subscriptions: Models.DocumentList<
    {
      userId: string;
      customer: string;
      subscription: string;
    } & Models.Document
  >;

  if (subscriptionCache.has(request.user.$id)) {
    subscriptions = subscriptionCache.get(request.user.$id);
  } else {
    subscriptions = await getSubscriptions(request.user.$id);
    if (subscriptions.total) {
      subscriptionCache.set(request.user.$id, subscriptions);
    }
  }

  if (!subscriptions.total) {
    if (!isPaymentPath(pathname))
      return NextResponse.redirect(new URL("/app/payment", request.url));
    else return NextResponse.next();
  }

  let stripeSubscription: Pick<
    Stripe.Response<Stripe.ApiList<Stripe.Subscription>>,
    "data"
  >;

  if (subscriptionCache.has(subscriptions.documents[0].customer)) {
    stripeSubscription = subscriptionCache.get(
      subscriptions.documents[0].customer
    );
  } else {
    stripeSubscription = await getStripeSubscriptions(
      subscriptions.documents[0].customer
    );
    subscriptionCache.set(
      subscriptions.documents[0].customer,
      stripeSubscription
    );
  }

  if (
    stripeSubscription.data.length &&
    stripeSubscription.data.some(
      (sub) => sub.status === "active" || sub.status === "trialing"
    )
  ) {
    const index = stripeSubscription.data.findIndex(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );
    const subscriptionStatus = stripeSubscription.data[index].status;
    if (isPaymentPath(pathname)) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url));
    }
    const headers: { [key: string]: any } = {
      "subscription-status": subscriptionStatus,
    };
    if (subscriptionStatus === "trialing") {
      headers["subscription-trial-end"] =
        stripeSubscription.data[index].trial_end;
      headers["subscription-trial-start"] =
        stripeSubscription.data[index].trial_start;
    }
    return NextResponse.next({
      headers,
    });
  } else {
    if (!isPaymentPath(pathname))
      return NextResponse.redirect(new URL("/app/payment", request.url));
    else return NextResponse.next();
  }
});

export const config = {
  matcher:
    "/((?!auth|payment/result|static|_next/static|_next/image|favicon.ico).*)",
  missing: [
    { type: "header", key: "next-router-prefetch" },
    { type: "header", key: "purpose", value: "prefetch" },
  ],
};
