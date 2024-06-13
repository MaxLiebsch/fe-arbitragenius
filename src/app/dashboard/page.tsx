"use server";
import ShopsGrid from "@/components/ShopsGrid";
import ShopsTable from "@/components/ShopsTable";
import { StarIcon } from "@heroicons/react/16/solid";
import { Button } from "antd";
import { mongoPromise } from "@/server/mongo";
import DashboardViewButton from "@/components/DashboardViewButton";
import ProductFilterForm from "@/components/forms/ProductFilterForm";
import { createSessionClient } from "@/server/appwrite";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";
import { headers } from "next/headers";
import { differenceInDays } from "date-fns";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: any;
}) {
  const headersList = headers();
  const status = headersList.get("subscription-status");
  const trialEnd = headersList.get("subscription-trial-end");
  const trialStart = headersList.get("subscription-trial-start");

  const { account } = await createSessionClient();
  const prefs = (await account.getPrefs()) as any;

  let settings = defaultProductFilterSettings;

  if (prefs?.settings && Object.keys(JSON.parse(prefs.settings)).length > 0){
    settings = JSON.parse(prefs.settings);
  }
  
  const view = searchParams.view ?? "grid";

  const mongo = await mongoPromise;

  const shopCount = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .countDocuments({
      active: { $eq: true },
    });

  return (
    <main className="h-full flex flex-col relative">
      {status === "trialing" ? (
        <div className="absolute text-center w-full">
          Danke, dass Du dich für Arbispotter entschieden hast. Du befindest
          Dich noch{" "}
          {differenceInDays(
            Number(trialEnd as string) * 1000,
            Number(trialStart as string) * 1000
          )}{" "}
          Tage in der Testphase.
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-row gap-2 mt-4 mb-3 items-center">
        <Button type="text">
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            <div>Retailer ({shopCount})</div>
          </h3>
        </Button>
        <Button type="text">
          <h3 className="flex flex-row gap-1 items-center justify-items-center text-base font-semibold leading-6 text-gray-900">
            <StarIcon className="h-6 w-6" />
            <div>Favoriten</div>
          </h3>
        </Button>
        <DashboardViewButton />
      </div>
      <section className="grow">
        {view === "grid" && (
          <>
            <div className="px-4 relative">
              <h3 className="text-base font-semibold leading-6 mb-3 text-gray-900 flex flex-row space-x-1 items-center">
                Produktfilter
              </h3>
              <ProductFilterForm settings={settings} />
              <div className="text-sm text-end text-gray-700 absolute bottom-0 right-4">
                Anzahl profitabler Produkte auf Grundlage deiner Einstellungen
              </div>
            </div>
          </>
        )}
        <div className="mb-8">
          {view === "table" ? <ShopsTable className="h-full" /> : <ShopsGrid />}
        </div>
      </section>
    </main>
  );
}
