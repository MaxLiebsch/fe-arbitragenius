"use client";
import ProductFilterPopover from "@/components/ProductFilterPopover";
import ShopsGrid from "@/components/ShopsGrid";
import ProductFilterForm from "@/components/forms/ProductFilterForm";
import { DISCLAIMER } from "@/constant/constant";
import useShopCount from "@/hooks/use-shop-count";

export default function Dashboard() {
  const shopCount = useShopCount();

  return (
    <main className="h-full flex flex-col relative">
        <div className="md:hidden">
          <ProductFilterPopover />
        </div>
      <section className="grow relative md:grid md:grid-cols-4 md:gap-2">
        <div className="hidden px-4 relative col-span-1 md:flex flex-col border-r border-gray-200">
          <h3 className="flex flex-row text-base font-semibold leading-6 mb-3 text-gray-dark space-x-1 items-center">
            Produktfilter
          </h3>
          <div className="flex overflow-y-auto h-[calc(100vh-130px)]">
            <ProductFilterForm />
          </div>
        </div>
        <div className="min-2xl:mb-8 ml-0 lg:ml-6 w-full col-span-3">
          {!shopCount.isLoading && (
            <>
              <div className="flex flex-row gap-2 pb-3 items-center">
                {shopCount.data && (
                  <h3 className="flex flex-row text-base font-semibold leading-6 mb-3 text-gray-dark space-x-1 items-center">
                    <div>Shops ({shopCount.data - 1})</div>
                  </h3>
                )}
              </div>
            </>
          )}
          <div className="text-xs md:text-sm text-end text-gray-dark absolute top-0 md:right-4">
            Anzahl profitabler Produkte auf Grundlage deiner Einstellungen
          </div>
          <div className="absolute text-gray-dark text-xs bottom-0 right-0">
            {DISCLAIMER}
          </div>
          <div className="flex h-[calc(100vh-180px)] overflow-y-auto w-full">
            <ShopsGrid />
          </div>
        </div>
      </section>
    </main>
  );
}
