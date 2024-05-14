"use server";
import ShopsGrid from "@/components/ShopsGrid";
import ShopsTable from "@/components/ShopsTable";
import { StarIcon } from "@heroicons/react/16/solid";
import { Button } from "antd";
import { mongoPromise } from "@/server/mongo";
import DashboardViewButton from "@/components/DashboardViewButton";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: any;
}) {
  const view = searchParams.view ?? "grid";

  const mongo = await mongoPromise;

  const shopCount = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .countDocuments({
      active: { $eq: true },
    });

  return (
    <main className="h-full flex flex-col space-y-5">
      <div className="flex flex-row gap-2 mt-6 items-center">
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
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          Einstellungen
        </h3>
        {view === "table" ? <ShopsTable className="h-full" /> : <ShopsGrid />}
      </section>
    </main>
  );
}
