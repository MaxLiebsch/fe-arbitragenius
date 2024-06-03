"use client";

import Plan from "@/components/Plan";
import { createCheckoutSession } from "@/server/actions/stripe";
import { getLoggedInUser } from "@/server/appwrite";
import Image from "next/image";
import { redirect } from "next/navigation";
import backgroundImage from "@/images/background-pricing.svg";

export default function Page() {
  const formActionMonthly = async (formData: FormData): Promise<void> => {
    const user = await getLoggedInUser();
    if (!user) redirect("/app/auth/signin");
    const { client_secret, url } = await createCheckoutSession(
      user.$id,
      user.email,
      "month"
    );
    window.location.assign(url as string);
  };

  const formActionYearly = async (formData: FormData): Promise<null> => {
    const user = await getLoggedInUser();
    if (!user) redirect("/app/auth/signin");
    const { client_secret, url } = await createCheckoutSession(
      user.$id,
      user.email,
      "year"
    );
    window.location.assign(url as string);
    return null;
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="absolute bg-no-repeat -left-[7rem] -top-4 lg:-left-[69rem] lg:-top-4 h-[180%] w-[180%] bg-secondary-950">
          <Image
            className="bg-no-repeat"
            src={backgroundImage}
            alt=""
            fill
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>
        <div className="md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            <span className="relative whitespace-nowrap">
              {/* <SwirlyDoodle className="absolute left-0 top-1/2 h-[1em] w-full fill-secondary-700" /> */}
              <span className="whitespace-break-spaces md:whitespace-normal">
                Transparente Preise ohne versteckte Kosten!
              </span>
            </span>{" "}
          </h2>
          <div className="relative flex justify-center">
            <p className="mt-4 max-w-2xl text-lg text-white">
              Wir ermöglichen mit unseren einfachen Preismodellen volle
              Flexibilität. Starte jetzt und sicher dir für kurze Zeit exklusive
              Rabatte.
            </p>
          </div>
        </div>
        <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-md flex flex-row items-center justify-center space-x-20">
          <form action={formActionMonthly} className="space-y-2">
            <input hidden name="monthly-plan"></input>
            <Plan
              featured
              name={
                <div className="text-silver-chalice-400 text-3xl line-through">
                  149€
                </div>
              }
              price={
                <div className="relative">
                  99€/<span className="text-3xl">Monat</span>
                  <span className="text-xs absolute -bottom-3 -right-1">
                    exkl. MwSt.
                  </span>
                </div>
              }
              description="monatlich kündbar"
              features={[]}
            />
          </form>

          <form action={formActionYearly} className="space-y-2">
            <input hidden name="yearly-plan"></input>
            <Plan
              name={
                <div className="text-silver-chalice-300 text-3xl line-through">
                  99€
                </div>
              }
              price={
                <div className="relative">
                  79€/<span className="text-3xl">Monat</span>
                  <span className="text-xs absolute -bottom-3 -right-1">
                    exkl. MwSt.
                  </span>
                </div>
              }
              description="im Abo"
              features={[]}
            />
          </form>
        </div>
      </div>
    </>
  );
}
