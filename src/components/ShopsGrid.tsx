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

export default function ShopsGrid() {
  const [paginationModel, setPaginationModel] = useState<ShopPagination>({
    page: 0,
    pageSize: 50,
  });

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
    <div className="grid grid-cols-3 gap-2 gap-y-3">
      {shopQuery.data?.map((shop) => (
        <Card key={shop.d} title={shop.ne} bordered={false}>
          <div className="flex flex-row gap-2 items-center">
            <Link href={`/dashboard/shop/${shop.d}`}>
              <>
                <p className="text-gray-500 font-bold">Total products - 123</p>
                <p className="text-gray-500 font-bold">
                  Profitiable ebay - 456
                </p>
                <p className="text-gray-500 font-bold">
                  Profitiable amazon - 789
                </p>
              </>
            </Link>
            <Button
              className="ml-auto"
              icon={
                favorites.data?.includes(shop.d) ? (
                  <StarIcon className="h-6 w-6" />
                ) : (
                  <StarIconOutline className="h-6 w-6" />
                )
              }
              onClick={() => handleToggleFavorite(shop.d)}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
