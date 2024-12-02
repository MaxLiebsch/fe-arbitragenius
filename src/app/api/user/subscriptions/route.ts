import { getLoggedInUser } from "@/server/appwrite";
import { getSubscriptions } from "@/server/appwrite/getSubscription";
import { cancelSubscription } from "@/server/stripe/middleware";
import { NextRequest } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SubscriptionUpdateBody = z.object({
  cancel_at_period_end: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const subscriptions = await getSubscriptions(user.$id);

  if (!subscriptions.total) {
    return new Response("No subscriptions", { status: 400 });
  }

  const subscription = subscriptions.documents[0];

  return new Response(JSON.stringify(subscription), { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const searchParams = request.nextUrl.searchParams;

  const subscriptionId = searchParams.get("subscriptionId");

  if (!subscriptionId) {
    return new Response("Subscription ID is required", { status: 400 });
  }

  const subscriptions = await getSubscriptions(user.$id);

  if (!subscriptions.total) {
    return new Response("No subscriptions", { status: 400 });
  }

  const subscription = subscriptions.documents[0];

  const body = await request.json();

  if (!body) {
    return new Response("Subscription Update Body is required", {
      status: 400,
    });
  }

  const parsedBody = SubscriptionUpdateBody.safeParse(body);

  if (!parsedBody.success) {
    return new Response("Invalid Subscription Update Body", { status: 400 });
  }

  try {
    const sub = await stripe.subscriptions.retrieve(subscription.subscription);

    if (sub.schedule) {
      await stripe.subscriptionSchedules.release(sub.schedule.toString());
    }

    await cancelSubscription(subscription.subscription, parsedBody.data);

    return new Response(
      parsedBody.data.cancel_at_period_end === true
        ? "Subscription gekündigt"
        : "Subscription forgesetzt",
      { status: 200 }
    );
  } catch (error) {
    console.log("error:", error);
    return new Response("Error", { status: 500 });
  }
}
