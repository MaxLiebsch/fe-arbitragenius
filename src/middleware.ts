import { NextResponse } from "next/server";
import { authMiddleware } from "./server/appwrite/middleware";
import { getStripeSubscriptions } from "./server/stripe/middleware";
import { getSubscriptions } from "./server/appwrite/getSubscription";
import { Models } from "node-appwrite";
import Stripe from "stripe";
import { subscriptionCache } from "./server/cache/subscriptionCache";

export const middleware = authMiddleware(async (request) => {
  const requestPathname = request.nextUrl.pathname;
  console.log('URL', request.url)
  console.log('NextURL', request.nextUrl)
  console.log('Redirect',request.redirect)
  if (!request.user) {
    if (
      requestPathname === "/api/sessions/email" ||
      requestPathname.startsWith("/api/account/verification") ||
      requestPathname.startsWith("/api/verify-email")
    ) {
      return NextResponse.next();
    }

    if (requestPathname.startsWith("/app/api")) {
      return new NextResponse("unauthorized", { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/app/auth/signin", request.url));
    }
  }

  if (requestPathname.startsWith("/api/user/subscriptions")) {
    return NextResponse.next();
  }

  if (requestPathname.startsWith("/api/account/verification")) {
    return NextResponse.next();
  }

  if (requestPathname.startsWith("/api/plans")) {
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
    if(subscriptions.total){
      subscriptionCache.set(request.user.$id, subscriptions);
    }
  }

  if (!subscriptions.total) {
    if (!requestPathname.startsWith("/payment"))
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
    if (requestPathname.startsWith("/payment")) {
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
    if (!requestPathname.startsWith("/payment"))
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
