"use client";

import { Button, Card } from "antd";
import { Shop } from "@/hooks/use-shop";
import Spinner from "./Spinner";
import useSalesCount from "@/hooks/use-sales-count";
import Link from "next/link";

const SalesTile = ({ shop }: { shop: Shop }) => {
  const { data: aCount, isFetching: aIsFetching } = useSalesCount("a");
  const { data: eCount, isFetching: eIsFetching } = useSalesCount("e");
  return (
    <>
      {aCount?.productCount || eCount?.productCount ? (
        <Card
          key={shop.d}
          title={
            <div className="flex flex-row items-center">
              <div className="flex flex-col">
                <div className="text-secondary">Sales Monitor</div>
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
                  <Link
                    className="flex-grow text-secondary border border-border-gray py-1"
                    href={`/dashboard/daily-deals?target=amazon`}
                  >
                    <p className="font-semibold flex flex-row hover:font-bold justify-center">
                      <span>Amazon: </span>
                      {aIsFetching ? (
                        <Spinner size={"!w-1 ml-4"} />
                      ) : (
                        <span className="ml-1">
                          {aCount?.productCount ?? 0}
                        </span>
                      )}
                    </p>
                  </Link>
                ) : null}
                {eCount?.productCount ? (
                  <Link
                    className="flex-grow text-secondary border border-border-gray py-1"
                    href={`/app/dashboard/daily-deals?target=ebay`}
                  >
                    <p className="font-semibold flex flex-row hover:font-bold justify-center">
                      <span>Ebay: </span>
                      {eIsFetching ? (
                        <Spinner size={"!w-1 ml-4"} />
                      ) : (
                        <span className="ml-1">
                          {eCount?.productCount ?? 0}
                        </span>
                      )}
                    </p>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </>
  );
};

export default SalesTile;
