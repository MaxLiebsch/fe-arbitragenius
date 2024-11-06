import Stripe from "stripe";

export async function getStripeSubscriptions(
  customer: string
): Promise<Pick<Stripe.Response<Stripe.ApiList<Stripe.Subscription>>, "data">> {
  const basicAuth =
    "Basic " +
    Buffer.from(process.env.STRIPE_SECRET_KEY! + ":").toString("base64");
  const response = await fetch(
    `https://api.stripe.com/v1/subscriptions?customer=${customer}`,
    {
      method: "GET",
      // @ts-ignore
      headers: {
        authorization: basicAuth,
      },
      cache: "no-store",
    }
  );

  if (response.ok) return response.json();
  else
    return {
      data: [],
    };
}

export async function getStripeInvoices(
  customer: string
): Promise<Pick<Stripe.Response<Stripe.ApiList<Stripe.Invoice>>, "data">> {
  const basicAuth =
    "Basic " +
    Buffer.from(process.env.STRIPE_SECRET_KEY! + ":").toString("base64");
  const response = await fetch(
    `https://api.stripe.com/v1/invoices?customer=${customer}`,
    {
      method: "GET",
      // @ts-ignore
      headers: {
        authorization: basicAuth,
      },
      cache: "no-store",
    }
  );

  if (response.ok) return response.json();
  else
    return {
      data: [],
    };
}

export async function getStripeSubscription(
  subscriptionId: string
): Promise<Stripe.Response<Stripe.Subscription>> {
  const basicAuth =
    "Basic " +
    Buffer.from(process.env.STRIPE_SECRET_KEY! + ":").toString("base64");
  const response = await fetch(
    `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
    {
      method: "GET",
      // @ts-ignore
      headers: {
        authorization: basicAuth,
      },
      cache: "no-store",
    }
  );

  if (response.ok) return response.json();
  else return {} as any;
}
