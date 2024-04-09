import type { Stripe } from "stripe";

import { stripe } from "@/server/stripe";
import Link from "next/link";
import { createDatabaseClient } from "@/server/appwrite";
import { ID, Query } from "node-appwrite";
import { Logo } from "@/components/Logo";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { userId: string; session_id: string };
}): Promise<JSX.Element> {
  if (!searchParams.userId) throw new Error("Please provide a valid userId");
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id);

  const databases = await createDatabaseClient();

  const subscription = await databases.listDocuments(
    process.env.NEXT_CUSTOMER_DB_ID!,
    process.env.NEXT_CUSTOMER_SUBSCRIPTION_ID!,
    [
      Query.equal("userId", searchParams.userId),
      Query.equal("customer", String(checkoutSession.customer)),
      Query.equal("subscription", String(checkoutSession.subscription)),
    ]
  );

  if (!subscription.total) {
    await databases.createDocument(
      process.env.NEXT_CUSTOMER_DB_ID!,
      process.env.NEXT_CUSTOMER_SUBSCRIPTION_ID!,
      ID.unique(),
      {
        userId: searchParams.userId,
        customer: checkoutSession.customer,
        subscription: checkoutSession.subscription,
      }
    );
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
          <Logo />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Subscription erfolgreich!
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <Link href="/dashboard">
            <button className="flex w-full justify-center rounded-md bg-chartreuse-yellow-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-chartreuse-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse-yellow-700">
              Zum Dashboard
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
