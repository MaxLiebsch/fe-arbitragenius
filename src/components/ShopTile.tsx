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
    "a",
    settings
  );
  const { data: eCount, isFetching: eIsFetching } = useProductCount(
    shop.d,
    "e",
    settings
  );
  function handleToggleFavorite(domain: string) {
    if (favorites?.includes(domain)) {
      favoriteRemoveMutation.mutate(domain);
    } else {
      favoriteAddMutation.mutate(domain);
    }
  }
  return (
    <Card key={shop.d} title={shop.ne} bordered={false}>
      <div className="flex flex-row gap-2 items-center">
        <Link href={`/dashboard/shop/${shop.d}`}>
          <>
            <p className="text-gray-500 font-bold">
              Produkte Gesamt - {shop.total ?? 0}
            </p>
            <p className="text-gray-500 font-bold flex flex-row">
              <span>Profitabel Amazon -</span>
              {aIsFetching ? (
                <Spinner size={"!w-2 ml-4"} />
              ) : (
                <span className='ml-1'>{aCount?.productCount ?? 0}</span>
              )}
            </p>
            <p className="text-gray-500 font-bold flex flex-row">
              <span>Profitabel Ebay - </span>
              {eIsFetching ? (
                <Spinner size={"!w-2 ml-4"} />
              ) : (
                <span className='ml-1'>{eCount?.productCount ?? 0}</span>
              )}
            </p>
          </>
        </Link>
        <Button
          className="ml-auto"
          icon={
            favorites?.includes(shop.d) ? (
              <StarIcon className="h-6 w-6" />
            ) : (
              <StarIconOutline className="h-6 w-6" />
            )
          }
          onClick={() => handleToggleFavorite(shop.d)}
        />
      </div>
    </Card>
  );
};

export default ShopTile;
