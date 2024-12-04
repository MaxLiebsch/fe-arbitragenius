"use client";
import ShopsGrid from "@/components/ShopsGrid";
import ProductFilterForm from "@/components/forms/ProductFilterForm";
import TotalDeals from "@/components/TotalDeals";
import useShopCount from "@/hooks/use-shop-count";

export default function Dashboard() {
  const shopCount = useShopCount();

  return (
    <main className="h-full flex flex-col relative">
      <section className="grow relative grid grid-cols-4 gap-2">
        <div className="px-4 relative col-span-1 flex flex-col border-r border-gray-200">
          <h3 className="flex flex-row text-base font-semibold leading-6 mb-3 text-gray-dark space-x-1 items-center">
            Produktfilter
          </h3>
          <div className="flex overflow-y-auto h-[calc(100vh-130px)]">
            <ProductFilterForm />
          </div>
        </div>
        <div className="mb-8 ml-6 col-span-3">
          {!shopCount.isLoading && (
            <>
              <div className="flex flex-row gap-2 pb-3 items-center">
                {shopCount.data && (
                  <h3 className="flex flex-row text-base font-semibold leading-6 mb-3 text-gray-dark space-x-1 items-center">
                    <div>Shops ({shopCount.data - 1})</div>
                  </h3>
                )}
              </div>
              <TotalDeals />
            </>
          )}
          <div className="text-sm text-end text-gray-dark absolute top-0 right-4">
            Anzahl profitabler Produkte auf Grundlage deiner Einstellungen
          </div>
          <div className="absolute text-gray-dark text-xs bottom-0 right-0">
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
