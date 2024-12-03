import { getLoggedInUser } from "@/server/appwrite";
import { getSubscriptions } from "@/server/appwrite/getSubscription";
import {
  getStripeInvoices,
  getStripeSubscription,
} from "@/server/stripe/middleware";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const subscriptions = await getSubscriptions(user.$id);

  if (!subscriptions.total) {
    return new Response("No subscriptions", { status: 400 });
  }

  const customer = subscriptions.documents[0].customer;

  const invoices = await getStripeInvoices(customer);

  const subscription = await getStripeSubscription(
    subscriptions.documents[0].subscription
  );

  if (subscription.schedule) {
    const schedule = await stripe.subscriptionSchedules.retrieve(
      subscription.schedule as string
    );
    if (
      schedule &&
      schedule.phases &&
      schedule.phases[1] &&
      schedule.phases[1].items &&
      schedule.phases[1].items[0] &&
      //@ts-ignore
      subscription.plan.id !== schedule.phases[1].items[0].plan
    ) {
      subscription.schedule = schedule;
    } else {
      subscription.schedule = null;
    }
  }

  return new Response(JSON.stringify({ invoices, subscription }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
