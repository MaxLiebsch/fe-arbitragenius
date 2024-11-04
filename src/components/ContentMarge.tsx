"use client";

import { ModifiedProduct } from "@/types/Product";
import { formatter } from "@/util/formatter";
import { Input, Switch } from "antd";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "./CopyToClipboard";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";
import { useUserSettings } from "@/hooks/use-settings";
import { getAvgPrice } from "@/util/getAvgPrice";

const ContentMarge = ({
  product,
}: {
  product: Pick<
    ModifiedProduct,
    | "costs"
    | "prc"
    | "a_prc"
    | "tax"
    | "mnfctr"
    | "shop"
    | "nm"
    | "eanList"
    | "a_useCurrPrice"
    | "a_qty"
    | "avg90_ahsprcs"
    | "avg90_ansprcs"
    | "avg30_ahsprcs"
    | "avg30_ansprcs"
    | "qty"
    | "a_avg_prc"
    | "qty"
  >;
}) => {
  const { prc, a_prc, a_avg_prc, a_qty, qty: buyQty, a_useCurrPrice } = product;

  let avgPrice = 0;
  const useAvgPrice = a_useCurrPrice !== undefined && a_useCurrPrice === false;

  if (useAvgPrice) {
    avgPrice = getAvgPrice(product as ModifiedProduct);
  }

  const isFlip = a_avg_prc !== undefined;
  const initBuyPrice = isFlip ? a_prc : prc;
  const initSellPrice = isFlip || useAvgPrice ? avgPrice : a_prc;

  const [settings, setSettings] = useUserSettings();
  const [transport, setTransportCosts] = useState(
    settings[settings.a_tptStandard as "a_tptSmall"]
  );
  const [fba, setFba] = useState(settings.fba);
  const [prepCenterCosts, setPrepCenterCosts] = useState(settings.a_prepCenter);
  const [storageCosts, setStorageCosts] = useState(settings.a_strg ?? 0);
  const [costs, setCosts] = useState(product["costs"]);
  const factor = a_qty / buyQty;
  const [buyPrice, setBuyPrice] = useState(
    roundToTwoDecimals((initBuyPrice / 1.19) * factor)
  );

  const strg_1_hy = new Date().getMonth() < 9;
  const [sellPrice, setSellPrice] = useState(initSellPrice);
  const [qty, setQty] = useState(1);
  const [period, setPeriod] = useState<"strg_1_hy" | "strg_2_hy">(
    strg_1_hy ? "strg_1_hy" : "strg_2_hy"
  );
  const multiplier = initSellPrice / product["costs"].azn;

  const tax = roundToTwoDecimals(
    sellPrice - sellPrice / (1 + (product.tax || 19) / 100)
  );

  useEffect(() => {
    if (!isFlip && useAvgPrice) {
      const provison = product["costs"].azn / a_prc;
      setCosts({
        ...product["costs"],
        azn: roundToTwoDecimals(sellPrice * provison),
      });
    }
  }, [product, isFlip, useAvgPrice, sellPrice, a_prc]);

  const externalCosts = fba
    ? costs.tpt + costs[period]
    : storageCosts + prepCenterCosts + transport;

  const earning =
    (sellPrice - costs.azn - costs.varc - externalCosts - tax - buyPrice) 
  // VK - Kosten - Steuern - EK / VK * 100
  const margin =
    ((sellPrice - costs.azn - costs.varc - externalCosts - tax - buyPrice) /
      sellPrice) *
    100;

  return (
    <div className="w-72 relative">
      <div className="-top-8 right-0 absolute">
        <Switch
          checkedChildren="Ohne FBA"
          unCheckedChildren="Mit FBA"
          onChange={(checked) => {
            if (checked) {
              setFba(true);
            } else {
              setFba(false);
            }
          }}
        />
      </div>
      <div className="font-light">
        <span>{product?.mnfctr ? product.mnfctr : ""} </span>
        {product.nm}
      </div>
      {product.eanList && product.eanList.length ? (
        <div className="mb-1">
          EAN: <CopyToClipboard text={product.eanList[0]} />
        </div>
      ) : (
        <></>
      )}
      <Input
        classNames={{ input: "!text-right" }}
        value={sellPrice}
        onChange={(e) => {
          setSellPrice(Number(e.target.value));
          setCosts({ ...costs, azn: Number(e.target.value) / multiplier });
        }}
        type="number"
        addonBefore="Verkaufspreis € (Brutto)"
      />
      <h3 className="font-semibold leading-6 mb-1 mt-2 text-gray-900 flex flex-row space-x-1 items-center">
        <div className="flex flex-row w-full">
          <p>Amazon Gebühren:</p>
          <p className="ml-auto">{formatter.format(costs.azn + costs.varc)}</p>
        </div>
      </h3>
      <div className="grid grid-rows-2">
        <div className="flex flex-row">
          <p>Verkaufsgebühr:</p>
          <p className="ml-auto">{formatter.format(costs.azn)}</p>
        </div>
        <div className="flex flex-row">
          <p>Variable Abschlussgebühr:</p>
          <p className="ml-auto">{formatter.format(costs.varc)}</p>
        </div>
      </div>
      {fba ? (
        <>
          <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
            <div className="flex flex-row w-full">
              <p>Versandkosten:</p>
              <p className="ml-auto">{formatter.format(costs.tpt)}</p>
            </div>
          </h3>
          <h3 className="font-semibold leading-6 mb-1 mt-2 text-gray-900 flex flex-row space-x-1 items-center">
            <div className="flex flex-row w-full">
              <p>Lagerkosten:</p>
              <p className="ml-auto">{formatter.format(costs[period])}</p>
            </div>
          </h3>
          <Switch
            checkedChildren="Januar-September"
            unCheckedChildren="Oktober-Dezember"
            defaultChecked={strg_1_hy}
            onChange={(checked) => {
              if (checked) {
                setPeriod("strg_1_hy");
              } else {
                setPeriod("strg_2_hy");
              }
            }}
          />
        </>
      ) : (
        <>
          <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
            <Input
              classNames={{ input: "!text-right" }}
              value={transport}
              onChange={(e) => {
                setTransportCosts(Number(e.target.value));
              }}
              type="number"
              step={0.01}
              addonBefore="Versandkosten €"
            />
          </h3>
          <h3 className="font-semibold leading-6 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
            <Input
              classNames={{ input: "!text-right" }}
              value={storageCosts}
              onChange={(e) => {
                setStorageCosts(Number(e.target.value));
              }}
              type="number"
              step={0.01}
              addonBefore="Lagerkosten €"
            />
          </h3>
          <h3 className="font-semibold leading-6 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
            <Input
              classNames={{ input: "!text-right" }}
              value={prepCenterCosts}
              onChange={(e) => {
                setPrepCenterCosts(Number(e.target.value));
              }}
              type="number"
              step={0.01}
              addonBefore="PrepCenter €"
            />
          </h3>
        </>
      )}
      <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
        <div className="flex flex-row w-full">
          <p>Sonstige Kosten:</p>
          <p className="ml-auto">{formatter.format(tax + buyPrice)}</p>
        </div>
      </h3>
      <div className="grid grid-rows-2 gap-1">
        <div className="flex flex-row">
          <p>Geschätze Umsatzsteuer ({product.tax} %):</p>
          <p className="ml-auto">{formatter.format(Number(tax))}</p>
        </div>
        <Input
          classNames={{ input: "!text-right" }}
          value={buyPrice}
          onChange={(e) => {
            setBuyPrice(Number(e.target.value) * factor);
          }}
          type="number"
          addonBefore="Einkaufspreis € (Netto)"
        />
        {/* <Input
          classNames={{ input: "!text-right" }}
          value={qty}
          step={1}
          min={1}
          onChange={(e) => {
            setQty(Number(e.target.value));
          }}
          type="number"
          addonBefore="Geschätzter Umsatz"
        /> */}
      </div>
      <div>
        <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
          <div className="flex flex-row w-full">
            <p>Nettogewinn:</p>
            <p
              className={`ml-auto ${
                earning < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatter.format(earning)}
            </p>
          </div>
        </h3>
        <h3 className="font-semibold leading-6 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
          <div className="flex flex-row w-full">
            <p>Nettospanne:</p>
            <p
              className={`ml-auto ${
                earning < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {margin.toFixed(2)} %
            </p>
          </div>
        </h3>
      </div>
    </div>
  );
};

export default ContentMarge;
