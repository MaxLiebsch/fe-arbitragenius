import type { Stripe } from "stripe";

import { stripe } from "@/server/stripe";
import Link from "next/link";
import { createDatabaseClient, getLoggedInUser } from "@/server/appwrite";
import { ID, Models, Query } from "node-appwrite";
import { Logo } from "@/components/Logo";
import { redirect } from "next/navigation";
import InvalidPage from "@/components/Invalid-Page";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { userId: string; session_id: string };
}): Promise<JSX.Element> {
  if (!searchParams.userId) throw new Error("Please provide a valid userId");

  const user = await getLoggedInUser();

  if (!user || user.$id !== searchParams.userId) {
    return <InvalidPage text="Der Link is ungültig." />;
  }

  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  try {
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.retrieve(searchParams.session_id);

    if (checkoutSession.metadata?.status === "saved") {
      return <InvalidPage text="Der Link is ungültig." />;
    }

    const databases = await createDatabaseClient();
    interface Subscription extends Models.Document {
      userId: string;
      customer: string;
      subscription: string;
      pastSubscriptions: string[];
    }
    const subscription = await databases.listDocuments<Subscription>(
      process.env.NEXT_CUSTOMER_DB_ID!,
      process.env.NEXT_CUSTOMER_SUBSCRIPTION_ID!,
      [
        Query.equal("userId", searchParams.userId),
        Query.equal("customer", String(checkoutSession.customer)),
      ]
    );

    if (subscription.total) {
      /*
         es gibt bereits ein Dokument mit den gleichen Daten
         wir muessen pruefen ob es sich um eine alte Session handelt
      */

      await databases.updateDocument(
        process.env.NEXT_CUSTOMER_DB_ID!,
        process.env.NEXT_CUSTOMER_SUBSCRIPTION_ID!,
        subscription.documents[0].$id,
        {
          userId: searchParams.userId,
          customer: checkoutSession.customer,
          subscription: checkoutSession.subscription,
        }
      );
      await stripe.checkout.sessions.update(checkoutSession.id, {
        metadata: {
          status: "saved",
        },
      });
    } else {
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
      await stripe.checkout.sessions.update(checkoutSession.id, {
        metadata: {
          status: "saved",
        },
      });
    }
  } catch (error) {
    return <InvalidPage text="Der Link is ungültig." />;
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
