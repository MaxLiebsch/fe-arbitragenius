"use server";

import { stripe } from "../stripe";
import { Stripe } from "stripe";
import { formatAmountForStripe } from "@/util/stripe-helpers";
import { headers } from "next/headers";

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  interval: "month" | "year"
) {
  const origin: string = headers().get("origin") as string;

  const amount = interval === "year" ? 79 * 12 : 99;

  const taxRate = await stripe.taxRates.create({
    display_name: "MwSt.",
    description: "Mehrwertsteuer 19%",
    jurisdiction: "DE",
    percentage: 19.0,
    inclusive: false,
  });

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "paypal"],
      customer_email: userEmail,
      line_items: [
        {
          quantity: 1,
          tax_rates: [taxRate.id],

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
      subscription_data: {
        trial_period_days: 7,
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
