import { getLoggedInUser } from "@/server/appwrite";
import { getSubscriptions } from "@/server/appwrite/getSubscription";
import { z } from "zod";
import { NextRequest } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SubscriptionUpdateBody = z.object({
  newInterval: z.literal("month").or(z.literal("year")),
});

// Function to schedule a plan switch
async function switchToYearlyAtEndOfCycle(
  subscriptionId: string,
  priceId: string
) {
  try {
    // Retrieve the subscription to get the current period end
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const taxRate = await stripe.taxRates.create({
      display_name: "MwSt.",
      description: "Mehrwertsteuer 19%",
      jurisdiction: "DE",
      percentage: 19.0,
      inclusive: false,
    });
    // Schedule the update
    let scheduleId = subscription.schedule;
    let currSchedule: Stripe.Response<Stripe.SubscriptionSchedule>;
    if (!scheduleId) {
      const newSchedule = await stripe.subscriptionSchedules.create({
        from_subscription: subscription.id,
      });
      scheduleId = newSchedule.id;
      currSchedule = newSchedule;
    } else {
      const schedule = await stripe.subscriptionSchedules.retrieve(
        scheduleId as string
      );
      currSchedule = schedule;
    }

    const subscriptionSchedule = await stripe.subscriptionSchedules.update(
      scheduleId as string,
      {
        end_behavior: "release", // Release the schedule after applying the update
        phases: [
          {
            items: [
              {
                price: currSchedule.phases[0].items[0].price.toString(),
                quantity: currSchedule.phases[0].items[0].quantity,
              },
            ],
            start_date: currSchedule.phases[0].start_date,
            end_date: currSchedule.phases[0].end_date,
          },
          {
            
            billing_cycle_anchor: "phase_start",
            start_date: subscription.current_period_end,
            proration_behavior: "none",
            items: [
              {
                price: priceId,
                quantity: 1,
                tax_rates: [taxRate.id],
              },
            ],
          },
        ],
      }
    );

    return subscriptionSchedule;
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
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
    const products = await stripe.products.list({
      limit: 3,
    });

    if (!products.data.length) {
      return new Response("No products found", { status: 400 });
    }

    const plan = products.data.find(
      (plan: Stripe.Product) =>
        plan.metadata.interval === parsedBody.data.newInterval
    );

    if (!plan) {
      return new Response("No matching plan found", { status: 400 });
    }

    const priceId = plan.default_price;

    if (!priceId) {
      return new Response("No price found", { status: 400 });
    }
    const schedule = await switchToYearlyAtEndOfCycle(
      subscriptionId,
      priceId as string
    );

    return new Response("Wechsel vollzogen.", { status: 200 });
  } catch (error) {
    return new Response("Subscription not found", { status: 400 });
  }
}
