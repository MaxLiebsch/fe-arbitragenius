"use server";

import { stripe } from "../stripe";
import { Stripe } from "stripe";
import { headers } from "next/headers";
import { SUBSCRIPTION_TRIAL_DAYS } from "@/constant/constant";

const createLineItem = async (
  priceId: string
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> => {
  const taxRate = await stripe.taxRates.create({
    display_name: "MwSt.",
    description: "Mehrwertsteuer 19%",
    jurisdiction: "DE",
    percentage: 19.0,
    inclusive: false,
  });
  return [
    {
      quantity: 1,
      price: priceId,
      tax_rates: [taxRate.id],
    },
  ];
};

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  userName: string,
  priceId: string
) {
  const origin: string = headers().get("origin") as string;

  const line_items = await createLineItem(priceId);

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: userEmail,
      billing_address_collection: "required",
      allow_promotion_codes: true,
      line_items,
      subscription_data: {
        trial_period_days: SUBSCRIPTION_TRIAL_DAYS,
      },
      success_url: `${origin}/app/payment/result?userId=${userId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/app/payment`,
      ui_mode: "hosted",
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createCheckoutSessionForKnownCustomer(
  customer: string,
  userId: string,
  priceId: string
) {
  const origin: string = headers().get("origin") as string;

  const line_items = await createLineItem(priceId);

  const checkoutParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    customer,
    billing_address_collection: "required",
    allow_promotion_codes: true,
    line_items,
    success_url: `${origin}/app/payment/result?userId=${userId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/app/payment`,
    ui_mode: "hosted",
  };

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(checkoutParams);
  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}
