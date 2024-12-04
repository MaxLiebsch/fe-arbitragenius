"use client";

import { TotalDealsContext } from "@/context/totalDealsContext";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import CountUp from "react-countup";
import Spinner from "./Spinner";
import { useUserSettings } from "@/hooks/use-settings";
import { Tooltip } from "antd";
const TotalDeals = () => {
  const queryClient = useQueryClient();
  const [ebayTotal, setEbayTotal] = React.useState(0);
  const [ebayPrevTotal, setEbayPrevTotal] = React.useState(0);
  const [settings] = useUserSettings();
  const ebay = ["e", "shop", "count"];
  const amazon = ["a", "shop", "count"];
  const [amazonTotal, setAmazonTotal] = React.useState(0);
  const [amazonPrevTotal, setAmazonPrevTotal] = React.useState(0);
  const { queryUpdate } = useContext(TotalDealsContext);

  const aTargetEnabled =
    settings &&
    settings.targetPlatforms &&
    settings.targetPlatforms.includes("a");
  const eTargetEnabled =
    settings &&
    settings.targetPlatforms &&
    settings.targetPlatforms.includes("e");

  useEffect(() => {
    if (settings.loaded === false) return;
    setEbayTotal(0);
    setEbayPrevTotal(0);
    setAmazonPrevTotal(0);
    setAmazonTotal(0);
    let ebayShops: string[] = [];
    let aznShops: string[] = [];
    queryClient.getQueryCache().subscribe(({ query }) => {
      const queryKey = query.queryKey as QueryKey;
      const shop = queryKey.length > 2 ? (queryKey[2] as string) : "";

      const { status, data } = query.state;
      if (
        status === "success" &&
        !ebayShops.includes(shop) &&
        ebay.every((value) => queryKey.includes(value))
      ) {
        ebayShops.push(queryKey[2] as string);
        setEbayTotal((state) => {
          setEbayPrevTotal(state);
          return state + data.productCount;
        });
      }
      if (
        status === "success" &&
        !aznShops.includes(shop) &&
        amazon.every((value) => queryKey.includes(value))
      ) {
        aznShops.push(queryKey[2] as string);
        setAmazonTotal((state) => {
          setAmazonPrevTotal(state);
          return state + data.productCount;
        });
      }
    });
  }, [queryUpdate, settings]);

  return (
    <div className="flex flex-row gap-2 items-center mb-3">
      <div className="border-secondary border w-72 group inline-flex items-center justify-center rounded-md py-2 px-4 font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 text-secondary">
        {amazonTotal > 0 ? (
          <CountUp
            className="block text-lg w-64 text-center"
            separator="."
            prefix="Profitabel Amazon "
            start={amazonPrevTotal}
            end={amazonTotal}
            duration={2.2}
          />
        ) : aTargetEnabled ? (
          <Spinner />
        ) : (
          <Tooltip
            color={"#11848d"}
            destroyTooltipOnHide
            title="Aktivere Amazon in den Profileinstellungen"
          >
            <p className="text-secondary">Amazon deaktiviert</p>
          </Tooltip>
        )}
      </div>
      <div className="border-secondary border w-72 group inline-flex items-center justify-center rounded-md py-2 px-4 font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 text-secondary">
        {ebayTotal > 0 ? (
          <CountUp
            className="block text-lg w-64 text-center"
            separator="."
            prefix="Profitabel Ebay "
            start={ebayPrevTotal}
            end={ebayTotal}
            duration={2.2}
          />
        ) : eTargetEnabled ? (
          <Spinner />
        ) : (
          <Tooltip
            color={"#11848d"}
            destroyTooltipOnHide
            title="Aktivere Ebay in den Profileinstellungen"
          >
            <p className="text-secondary">Ebay deaktiviert</p>
          </Tooltip>
        )}
      </div>
      <div className="border-secondary border w-72 group inline-flex items-center justify-center rounded-md py-2 px-4 font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 text-secondary">
        <p className="text-secondary">Kaufland (Coming soon)</p>
      </div>
    </div>
  );
};

export default TotalDeals;
