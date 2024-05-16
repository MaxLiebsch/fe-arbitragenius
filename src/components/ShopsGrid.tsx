"use client";

import Link from "next/link";
import { Button, Card, Spin } from "antd";
import { StarIcon } from "@heroicons/react/16/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { useState } from "react";
import useShops, { ShopPagination } from "@/hooks/use-shops";
import useFavorites from "@/hooks/use-favorites";
import useFavoriteAdd from "@/hooks/use-favorite-add";
import useFavoriteRemove from "@/hooks/use-favorite-remove";
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
  const favoriteAddMutation = useFavoriteAdd();
  const favoriteRemoveMutation = useFavoriteRemove();

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

  function handleToggleFavorite(domain: string) {
    if (favorites.data?.includes(domain)) {
      favoriteRemoveMutation.mutate(domain);
    } else {
      favoriteAddMutation.mutate(domain);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 gap-y-3">
      {shopQuery.data?.map((shop) => (
        <ShopTile settings={settings} key={shop.d} shop={shop} favorites={favorites.data} />
      ))}
    </div>
  );
}
