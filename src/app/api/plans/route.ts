import Stripe from "stripe";

export async function GET() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const products = await stripe.products.list({
    limit: 3,
  });

  return new Response(JSON.stringify(products), { status: 200 });
}
