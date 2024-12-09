"use client";

import Plan from "@/components/Plan";
import { getLoggedInUser } from "@/server/appwrite";
import Image from "next/image";
import backgroundImage from "@/images/background-pricing.svg";
import { message } from "antd";
import {
  createCheckoutSession,
  createCheckoutSessionForKnownCustomer,
} from "@/server/actions/stripe";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const features = [
  `Unterstützte Platformen:
  <ul>
  <li>- Amazon</li>
  <li>- Ebay</li>
  <li>- Kaufland (Coming soon)</li></ul>`,
  "Onlineshop-Vergleich (über 1,4 Millionen Produkte)",
  "Sales-Monitor",
  "Amazon Flips",
  "Wholesale Analyse / Großhandellisten Analyse",
  "KI-gestützte Matchvalidierung und Bündelerkennung",
  "Export zu ArbitrageOne",
  "Kostenloser Support",
];

export default function Page() {
  const formAction = async (formData: FormData): Promise<void> => {
    if (!formData.get("interval")) {
      message.error("Bitte wähle ein Abo aus.");
      return;
    }
    const interval = formData.get("interval") as string;

    if (interval !== "month" && interval !== "year" && interval !== "earlybird") {
      message.error("Ungültiges Abo.");
      return;
    }

    const plans = await fetch("/app/api/plans", {
      method: "GET",
    });

    if (!plans.ok) {
      message.error("Fehler beim Laden der Preise.");
      return;
    }

    const stripeProductResponse = await plans.json();

    if (!stripeProductResponse.data?.length) {
      message.error("Fehler beim Laden der Preise.");
      return;
    }

    const priceId = stripeProductResponse.data.find(
      (plan: Stripe.Product) => plan.metadata.interval === interval
    ).default_price;

    const user = await getLoggedInUser();

    if (!user) redirect("/app/auth/signin");

    const existingSubscription = await fetch("/app/api/user/subscriptions", {
      method: "GET",
    });
    if (existingSubscription.ok) {
      const data = await existingSubscription.json();

      if (data.customer) {
        const { client_secret, url } =
          await createCheckoutSessionForKnownCustomer(
            data.customer,
            user.$id,
            priceId
          );
        window.location.assign(url as string);
      }
    } else {
      const { client_secret, url } = await createCheckoutSession(
        user.$id,
        user.email,
        user.name,
        priceId
      );
      window.location.assign(url as string);
    }
  };

  return (
    <div className="flex flex-1 relative  flex-col justify-center px-6 py-12 lg:px-8 overflow-hidden">
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
      <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
        <form action={formAction} className="space-y-2">
          <input hidden name="interval" defaultValue="earlybird" />
          <Plan
            featured="Early Bird"
            name={
              <div className="text-silver-chalice-400 text-3xl line-through">
                149€
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
            description={
              <span>
                im Early Bird Abo (limitiert)
              </span>
            }
            features={features}
          />
        </form>

        <form action={formAction} className="space-y-2">
          <input hidden name="interval" defaultValue="month" />
          <Plan
            name={
              <div className="text-silver-chalice-400 text-3xl line-through">
                199€
              </div>
            }
            price={
              <div className="relative">
                149€/<span className="text-3xl">Monat</span>
                <span className="text-xs absolute -bottom-3 -right-1">
                  exkl. MwSt.
                </span>
              </div>
            }
            description="im Monatsabo"
            features={features}
          />
        </form>

        <form action={formAction} className="space-y-2">
          <input hidden name="interval" defaultValue="year"></input>
          <Plan
            name={
              <div className="text-silver-chalice-300 text-3xl line-through">
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
            description="im Jahresabo"
            features={features}
          />
        </form>
      </div>
    </div>
  );
}
