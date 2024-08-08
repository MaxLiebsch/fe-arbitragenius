"use server";
import ShopsGrid from "@/components/ShopsGrid";
import { StarIcon } from "@heroicons/react/16/solid";
import { mongoPromise } from "@/server/mongo";
import ProductFilterForm from "@/components/forms/ProductFilterForm";
import { createSessionClient } from "@/server/appwrite";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";
import TotalDeals from "@/components/TotalDeals";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: any;
}) {
  const { account } = await createSessionClient();
  const prefs = (await account.getPrefs()) as any;

  let settings = defaultProductFilterSettings;

  if (prefs?.settings && Object.keys(JSON.parse(prefs.settings)).length > 0) {
    settings = {
      ...defaultProductFilterSettings,
      ...JSON.parse(prefs.settings),
    };
  }

  const mongo = await mongoPromise;

  const shopCount = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .countDocuments({
      active: { $eq: true },
    });

  return (
    <main className="h-full flex flex-col relative">
      <section className="grow relative grid grid-cols-4 gap-2">
        <div className="px-4 relative col-span-1 flex flex-col border-r border-gray-200">
          <h3 className="flex flex-row text-base font-semibold leading-6 mb-3 text-gray-900 space-x-1 items-center">
            Produktfilter
          </h3>
          <div className="flex overflow-y-auto h-[calc(100vh-130px)]">
            <ProductFilterForm settings={settings} />
          </div>
        </div>
        <div className="mb-8 ml-6 col-span-3">
          <div className="flex flex-row gap-2 pb-3 items-center">
            <h3 className="flex flex-row text-base font-semibold leading-6 mb-3 text-gray-900 space-x-1 items-center">
              <div>Retailer ({shopCount})</div>
            </h3>
            <h3 className="flex flex-row text-base font-semibold leading-6 mb-3 text-gray-900 space-x-1 items-center">
              <StarIcon className="h-6 w-6" />
              <div>Favoriten</div>
            </h3>
          </div>
          <TotalDeals />
          <div className="text-sm text-end text-gray-700 absolute top-0 right-4">
            Anzahl profitabler Produkte auf Grundlage deiner Einstellungen
          </div>
          <div className="absolute text-primary-950 text-xs bottom-0 right-0">
            DipMax Export GmbH übernimmt für die dargestellten Informationen und
            deren Genauigkeit und Vollständigkeit keine Gewährleistung.
          </div>
          <div className="flex h-[calc(100vh-250px)] overflow-y-auto w-full">
            <ShopsGrid />
          </div>
        </div>
      </section>
    </main>
  );
}
