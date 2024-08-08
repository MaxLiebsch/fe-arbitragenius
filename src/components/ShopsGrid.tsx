"use client";
import { useState } from "react";
import useShops, { ShopPagination } from "@/hooks/use-shops";
import useFavorites from "@/hooks/use-favorites";
import Spinner from "./Spinner";
import ShopTile from "./ShopTile";
import usePreferences from "@/hooks/use-preferences";

export default function ShopsGrid() {
  const [paginationModel, setPaginationModel] = useState<ShopPagination>({
    page: 0,
    pageSize: 100,
  });
  const {data: settings} = usePreferences('settings')
  const shopQuery = useShops(paginationModel);
  const favorites = useFavorites();

  if (shopQuery.isLoading)
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-2 gap-y-3 w-full">
      {shopQuery.data?.map((shop) => (
        <ShopTile settings={settings} key={shop.d} shop={shop} favorites={favorites.data} />
      ))}
    </div>
  );
}
