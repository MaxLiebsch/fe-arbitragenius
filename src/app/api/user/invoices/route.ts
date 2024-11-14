import { getLoggedInUser } from "@/server/appwrite";
import { getSubscriptions } from "@/server/appwrite/getSubscription";
import {
  getStripeInvoices,
  getStripeSubscription,
} from "@/server/stripe/middleware";

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

  return new Response(JSON.stringify({ invoices, subscription }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
