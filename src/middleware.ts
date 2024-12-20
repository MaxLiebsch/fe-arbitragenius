import { NextResponse } from "next/server";
import { authMiddleware } from "./server/appwrite/middleware";
import { getStripeSubscriptions } from "./server/stripe/middleware";
import { getSubscriptions } from "./server/appwrite/getSubscription";
import { Models } from "node-appwrite";
import Stripe from "stripe";
import { subScriptionCache } from "./server/cache/subscriptionCache";

const isApi = (requestPathname: string) => requestPathname.includes("/api");

const isExceptionPath = (requestPathname: string) =>
  requestPathname.includes("/api/sessions/email") ||
  requestPathname.includes("/api/account/verification") ||
  requestPathname.includes("/api/verify-email");

const isSubscriptionPath = (requestPathname: string) =>
  requestPathname.includes("/api/user/subscriptions");

const isPlanPath = (requestPathname: string) =>
  requestPathname.includes("/api/user/plans");

const isVerificationPath = (requestPathname: string) =>
  requestPathname.includes("/api/account/verification");

const isPaymentPath = (requestPathname: string) =>
  requestPathname.includes("/payment");

export const middleware = authMiddleware(async (request) => {
  const requestPathname = request.nextUrl.pathname;
  
  if (!request.user) {
    if (isExceptionPath(requestPathname)) {
      return NextResponse.next();
    }
    if (isApi(requestPathname)) {
      return new NextResponse("unauthorized", { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/app/auth/signin", request.url));
    }
  }

  if (isSubscriptionPath(requestPathname)) {
    return NextResponse.next();
  }

  if (isVerificationPath(requestPathname)) {
    return NextResponse.next();
  }

  if (isPlanPath(requestPathname)) {
    return NextResponse.next();
  }

  let subscriptions: Models.DocumentList<
    {
      userId: string;
      customer: string;
      subscription: string;
    } & Models.Document
  >;

  if (subScriptionCache.has(request.user.$id)) {
    subscriptions = subScriptionCache.get(request.user.$id);
  } else {
    subscriptions = await getSubscriptions(request.user.$id);
    if (subscriptions.total) {
      subScriptionCache.set(request.user.$id, subscriptions);
    }
  }

  if (!subscriptions.total) {
    if (!isPaymentPath(requestPathname))
      return NextResponse.redirect(new URL("/app/payment", request.url));
    else return NextResponse.next();
  }

  let stripeSubscription: Pick<
    Stripe.Response<Stripe.ApiList<Stripe.Subscription>>,
    "data"
  >;

  if (subScriptionCache.has(subscriptions.documents[0].customer)) {
    stripeSubscription = subScriptionCache.get(
      subscriptions.documents[0].customer
    );
  } else {
    stripeSubscription = await getStripeSubscriptions(
      subscriptions.documents[0].customer
    );
    subScriptionCache.set(
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
    if (isPaymentPath(requestPathname)) {
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
    if (!isPaymentPath(requestPathname))
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
