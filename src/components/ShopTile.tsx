"use client";

import Link from "next/link";
import { Button, Card, Spin } from "antd";
import { StarIcon } from "@heroicons/react/16/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import useFavoriteAdd from "@/hooks/use-favorite-add";
import useFavoriteRemove from "@/hooks/use-favorite-remove";
import { Shop } from "@/hooks/use-shop";
import useProductCount from "@/hooks/use-product-count";
import { Settings } from "@/types/Settings";
import Spinner from "./Spinner";

const ShopTile = ({
  shop,
  favorites,
  settings,
}: {
  favorites: any;
  shop: Shop;
  settings: Settings;
}) => {
  const favoriteAddMutation = useFavoriteAdd();
  const favoriteRemoveMutation = useFavoriteRemove();

  const { data: aCount, isFetching: aIsFetching } = useProductCount(
    shop.d,
    "a"
  );
  const { data: eCount, isFetching: eIsFetching } = useProductCount(
    shop.d,
    "e"
  );
  function handleToggleFavorite(domain: string) {
    if (favorites?.includes(domain)) {
      favoriteRemoveMutation.mutate(domain);
    } else {
      favoriteAddMutation.mutate(domain);
    }
  }
  return (
    <Card
      key={shop.d}
      title={
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <div>{shop.ne}</div>
            <div className="text-sm font-thin text-gray-500">
              Gesamt: {shop.total ?? 0}
            </div>
          </div>
          <Button
            className="ml-auto"
            icon={
              favorites?.includes(shop.d) ? (
                <StarIcon className="h-4 w-4" />
              ) : (
                <StarIconOutline className="h-4 w-4" />
              )
            }
            onClick={() => handleToggleFavorite(shop.d)}
          />
        </div>
      }
      bordered={false}
      style={{ width: "100%" }}
    >
      <div className="flex flex-row gap-2 items-center">
        <div className="w-full">
          <p className="w-full border-b border-gray-200 mb-2">Profitabel</p>
          <div className="flex flex-row gap-1">
            <Button
              className="flex-grow"
              href={`/app/dashboard/shop/${shop.d}?target=amazon`}
            >
              <p className=" font-semibold flex flex-row hover:font-bold justify-center">
                <span>Amazon: </span>
                {aIsFetching ? (
                  <Spinner size={"!w-1 ml-4"} />
                ) : (
                  <span className="ml-1">{aCount?.productCount ?? 0}</span>
                )}
              </p>
            </Button>
            <Button
              className="flex-grow"
              href={`/app/dashboard/shop/${shop.d}?target=ebay`}
            >
              <p className=" font-semibold flex flex-row hover:font-bold justify-center">
                <span>Ebay: </span>
                {eIsFetching ? (
                  <Spinner size={"!w-1 ml-4"} />
                ) : (
                  <span className="ml-1">{eCount?.productCount ?? 0}</span>
                )}
              </p>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShopTile;
