"use client";

import { ModifiedProduct } from "@/types/Product";
import { formatter } from "@/util/formatter";
import { Input, Switch } from "antd";
import React, { useState } from "react";
import CopyToClipboard from "./CopyToClipboard";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";

const ContentMarge = ({
  product,
}: {
  product: Pick<
    ModifiedProduct,
    "costs" | "prc" | "a_prc" | "tax" | "mnfctr" | "nm" | "eanList"
  >;
}) => {
  const [costs, setCosts] = useState(product["costs"]);
  const [buyPrice, setBuyPrice] = useState(
    roundToTwoDecimals(product["prc"] / 1.19)
  );
  const [price, setPrice] = useState(product["a_prc"]);
  const [qty, setQty] = useState(1);
  const [period, setPeriod] = useState<"strg_1_hy" | "strg_2_hy">("strg_1_hy");

  const multiplier = product.a_prc / product["costs"].azn;
  const tax = roundToTwoDecimals(price - price / (1 + product.tax / 100));
  const earning =
    (price -
      costs.azn -
      costs.varc -
      costs.tpt -
      costs[period] -
      tax -
      buyPrice) *
    qty;
  // VK - Kosten - Steuern - EK / VK * 100
  const margin =
    ((price -
      costs.azn -
      costs.varc -
      costs.tpt -
      costs[period] -
      tax -
      buyPrice) /
      price) *
    100;

  return (
    <div className="w-72">
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
        value={price}
        onChange={(e) => {
          setPrice(Number(e.target.value));
          setCosts({ ...costs, azn: Number(e.target.value) / multiplier });
        }}
        type="number"
        addonBefore="Verkaufspreis € (Brutto)"
      />
      <h3 className="text-xs font-semibold leading-6 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
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
      <h3 className="text-xs font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
        <div className="flex flex-row w-full">
          <p>Versandkosten:</p>
          <p className="ml-auto">{formatter.format(costs.tpt)}</p>
        </div>
      </h3>
      <Switch
        checkedChildren="Januar-September"
        unCheckedChildren="Oktober-Dezember"
        defaultChecked
        onChange={(checked) => {
          if (checked) {
            setPeriod("strg_1_hy");
          } else {
            setPeriod("strg_2_hy");
          }
        }}
      />
      <h3 className="text-xs font-semibold leading-6 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
        <div className="flex flex-row w-full">
          <p>Lagerkosten:</p>
          <p className="ml-auto">{formatter.format(costs[period])}</p>
        </div>
      </h3>
      <h3 className="text-xs font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
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
            setBuyPrice(Number(e.target.value));
          }}
          type="number"
          addonBefore="Einkaufspreis € (Netto)"
        />
        <Input
          classNames={{ input: "!text-right" }}
          value={qty}
          step={1}
          min={1}
          onChange={(e) => {
            setQty(Number(e.target.value));
          }}
          type="number"
          addonBefore="Geschätzter Umsatz"
        />
      </div>
      <div>
        <h3 className="text-xs font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
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
        <h3 className="text-xs font-semibold leading-6 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
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
