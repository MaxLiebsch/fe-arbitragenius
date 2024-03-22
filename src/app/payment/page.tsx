"use client";

import { createCheckoutSession } from "@/server/actions/stripe";
import { getLoggedInUser } from "@/server/appwrite";
import { Card } from "antd";
import { redirect } from "next/navigation";

export default function Page() {
  const formActionMonthly = async (): Promise<void> => {
    const user = await getLoggedInUser();
    if (!user) redirect("/auth/signin");
    const { client_secret, url } = await createCheckoutSession(
      user.$id,
      "month"
    );
    window.location.assign(url as string);
  };

  const formActionYearly = async (): Promise<void> => {
    const user = await getLoggedInUser();
    if (!user) redirect("/auth/signin");
    const { client_secret, url } = await createCheckoutSession(
      user.$id,
      "year"
    );
    window.location.assign(url as string);
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
          <img
            className="mx-auto h-10 w-auto"
            src="/static/arbispotter_left-black.png"
            alt="Arbispotter"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Wähle deine Subscription
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md flex flex-row space-x-5">
          <Card title={"Monatlich"} bordered={true} className="grow">
            <form action={formActionMonthly} className="space-y-2">
              <div className="text-2xl">
                149,00€ <div className="inline text-sm">/ Monat</div>
              </div>
              <button className="flex w-full justify-center rounded-md bg-chartreuse-yellow-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-chartreuse-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse-yellow-700">
                Checkout
              </button>
            </form>
          </Card>
          <Card title={"Jährlich"} bordered={true} className="grow">
            <form action={formActionYearly} className="space-y-2">
              <div className="text-2xl">
                99,00€ <div className="inline-block text-sm">/ Monat</div>
              </div>
              <button className="flex w-full justify-center rounded-md bg-chartreuse-yellow-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-chartreuse-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse-yellow-700">
                Checkout
              </button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
