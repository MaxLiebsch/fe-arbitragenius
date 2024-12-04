"use client";
import { Button, Card } from "antd";
import { Shop } from "@/hooks/use-shop";
import useProductCount from "@/hooks/use-product-count";
import Spinner from "./Spinner";

const ShopTile = ({ shop }: { shop: Shop }) => {
  const { data: aCount, isFetching: aIsFetching } = useProductCount(
    shop.d,
    "a"
  );
  const { data: eCount, isFetching: eIsFetching } = useProductCount(
    shop.d,
    "e"
  );

  return (
    <>
      {aCount?.productCount || eCount?.productCount ? (
        <Card
          key={shop.d}
          title={
            <div className="flex flex-row items-center">
              <div className="flex flex-col">
                <div className="text-secondary">{shop.ne}</div>
                <div className="text-sm font-thin text-gray">
                  Gesamt: {shop.total ?? 0}
                </div>
              </div>
            </div>
          }
          bordered={false}
          style={{ width: "100%" }}
        >
          <div className="flex flex-row gap-2 items-center">
            <div className="w-full">
              <p className="w-full border-b border-gray-200 mb-2">Profitabel</p>
              <div className="flex flex-row gap-1">
                {aCount?.productCount ? (
                  <Button
                    className="flex-grow"
                    href={`/app/dashboard/shop/${shop.d}?target=amazon`}
                  >
                    <p className=" font-semibold flex flex-row hover:font-bold justify-center">
                      <span>Amazon: </span>
                      {aIsFetching ? (
                        <Spinner size={"!w-1 ml-4"} />
                      ) : (
                        <span className="ml-1">
                          {aCount?.productCount ?? 0}
                        </span>
                      )}
                    </p>
                  </Button>
                ) : (
                  <></>
                )}
                {eCount?.productCount ? (
                  <Button
                    className="flex-grow"
                    href={`/app/dashboard/shop/${shop.d}?target=ebay`}
                  >
                    <p className=" font-semibold flex flex-row hover:font-bold justify-center">
                      <span>Ebay: </span>
                      {eIsFetching ? (
                        <Spinner size={"!w-1 ml-4"} />
                      ) : (
                        <span className="ml-1">
                          {eCount?.productCount ?? 0}
                        </span>
                      )}
                    </p>
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </>
  );
};

export default ShopTile;
