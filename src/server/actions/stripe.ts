"use server";

import { stripe } from "../stripe";
import { Stripe } from "stripe";
import { formatAmountForStripe } from "@/util/stripe-helpers";
import { headers } from "next/headers";

export async function createCheckoutSession(
  userId: string,
  interval: "month" | "year"
) {
  const origin: string = headers().get("origin") as string;

  const amount = interval === "year" ? 99 * 12 : 149;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "EUR",
            product_data: {
              name: "Arbispotter Subscription",
            },
            unit_amount: formatAmountForStripe(amount, "EUR"),
            recurring: {
              interval,
              interval_count: 1,
            },
          },
        },
      ],
      subscription_data: {},
      success_url: `${origin}/app/payment/result?userId=${userId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/app/payment`,
      ui_mode: "hosted",
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}
