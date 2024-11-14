"use client";
import { useState } from "react";
import useShops, { ShopPagination } from "@/hooks/use-shops";
import Spinner from "./Spinner";
import ShopTile from "./ShopTile";
import SalesTile from "./SalesTile";
import { useUserSettings } from "@/hooks/use-settings";

export default function ShopsGrid() {
  const [paginationModel, setPaginationModel] = useState<ShopPagination>({
    page: 0,
    pageSize: 100,
  });

  const shopQuery = useShops(paginationModel);
  const [settings] = useUserSettings();

  if (shopQuery.isLoading || settings.loaded === false)
    return (
      <div className="h-full flex items-center justify-center w-full">
        <Spinner />
      </div>
    );

  if (shopQuery.isError)
    return (
      <div className="h-full flex items-center justify-center w-full">
        Oops ...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-1 lg:gap-2 gap-y-3 w-full">
      {shopQuery.data &&
        [...shopQuery.data].map((shop) => {
          if (shop.d === "sales") {
            return (
              <SalesTile
                key={shop.d}
                shop={shop}
              />
            );
          }
          return (
            <ShopTile 
              key={shop.d}
              shop={shop}
            />
          );
        })}
    </div>
  );
}
