"use client";

import { Button, Card } from "antd"
import { Shop } from "@/hooks/use-shop";
import Spinner from "./Spinner";
import useSalesCount from "@/hooks/use-sales-count";

const SalesTile = ({
  shop,
}: {
  shop: Shop;
}) => {
 


  const { data: aCount, isFetching: aIsFetching } = useSalesCount("a");
  const { data: eCount, isFetching: eIsFetching } = useSalesCount(
    "e"
  );
  return (
    <Card
      key={shop.d}
      title={
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <div>Sales Monitor</div>
            <div className="text-sm font-thin text-gray-500">
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
            <Button
              className="flex-grow"
              href={`/app/dashboard/daily-deals?target=amazon`}
            >
              <p className="font-semibold flex flex-row hover:font-bold">
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
              href={`/app/dashboard/daily-deals?target=ebay`}
            >
              <p className="font-semibold flex flex-row hover:font-bold">
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

export default SalesTile;
