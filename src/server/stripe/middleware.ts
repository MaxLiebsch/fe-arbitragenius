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

interface Address {
  line1: string;
  city: string;
  country: string;
  line2: string;
  postal_code: string;
  state: string;
}

interface CustomerData {
  name?: string;
  address?: Address;
  shipping?: {
    name: string;
    address: Address;
  };
}

export async function updateCustomerInformation(
  customer: string,
  data: CustomerData
): Promise<Stripe.Response<Stripe.Customer>> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const response = await stripe.customers.update(customer, data);
  return response;
}

export async function cancelSubscription(subscriptionId: string, body: any) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  if (Object.keys(body).length) {
    const response = await stripe.subscriptions.update(subscriptionId, body);
    return response;
  } else {
    const response = await stripe.subscriptions.cancel(subscriptionId);
    return response;
  }
}
