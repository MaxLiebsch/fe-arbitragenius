"use client";
import { ModifiedProduct } from "@/types/Product";
import { appendPercentage, formatter } from "@/util/formatter";
import { Checkbox, InputNumber, Switch } from "antd";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "./CopyToClipboard";
import {
  roundToFourDecimals,
  roundToTwoDecimals,
} from "@/util/roundToTwoDecimals";
import { useUserSettings } from "@/hooks/use-settings";
import { getAvgPrice } from "@/util/getAvgPrice";
import { calculateTax } from "@/util/calculateTax";
import { calculateNetPrice } from "@/util/calculateNetPrice";
import ArbitrageOneExportBtn from "./ArbitrageOneExportBtn";
import { addCosts } from "@/util/addCosts";
import {
  mrgnFieldName,
  mrgnPctFieldName,
} from "@/util/productQueries/mrgnProps";

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
    | "lnk"
    | "shop"
    | "asin"
    | "nm"
    | "a_w_mrgn"
    | "a_avg_price"
    | "a_p_w_mrgn"
    | "a_w_mrgn_pct"
    | "a_p_w_mrgn"
    | "a_p_w_mrgn_pct"
    | "a_p_mrgn"
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
  const {
    prc,
    a_prc,
    a_qty,
    a_avg_prc,
    qty: buyQty,
    shop,
    a_avg_price,
    asin,
  } = product;

  let avgPrice = a_avg_price

  const isFlip = a_avg_prc !== undefined;
  const initBuyPrice = isFlip ? a_prc : prc;
  const flipQty = isFlip ? a_qty : buyQty;
  const initSellPrice = avgPrice === 0 ? a_prc : avgPrice;

  const [settings, setSettings] = useUserSettings();
  const [transport, setTransportCosts] = useState(
    settings[settings.a_tptStandard as "a_tptSmall"]
  );
  const [fba, setFba] = useState(settings.fba);
  const [firstLoad, setFirstLoad] = useState(true);
  const [prepCenterCosts, setPrepCenterCosts] = useState(settings.a_prepCenter);
  const [storageCosts, setStorageCosts] = useState(settings.a_strg ?? 0);
  const [costs, setCosts] = useState(product["costs"]);
  const factor = a_qty / flipQty;
  const [netBuyPrice, setNetBuyPrice] = useState(
    calculateNetPrice(initBuyPrice, product.tax) * factor
  );
  const earningsFieldName = mrgnFieldName("a", settings.euProgram);
  const marginFieldName = mrgnPctFieldName("a", settings.euProgram);
  const [earnings, setEarnings] = useState<number>(
    (product as ModifiedProduct)[earningsFieldName as keyof ModifiedProduct]
  );
  const [margin, setMargin] = useState<number>(
    (product as ModifiedProduct)[marginFieldName as keyof ModifiedProduct]
  );
  const [roi, setRoi] = useState<number>(
    roundToFourDecimals(earnings / netBuyPrice) * 100
  );
  const strg_1_hy = new Date().getMonth() < 9;
  const [sellPrice, setSellPrice] = useState(initSellPrice);
  const [period, setPeriod] = useState<"strg_1_hy" | "strg_2_hy">(
    strg_1_hy ? "strg_1_hy" : "strg_2_hy"
  );
  const multiplier = initSellPrice / product["costs"].azn;

  const tax = calculateTax(sellPrice, product.tax);

  const externalCosts = fba
    ? costs.tpt + costs[period] + prepCenterCosts
    : storageCosts + prepCenterCosts + transport;

  const totalCosts = addCosts([
    costs.azn,
    costs.varc,
    externalCosts,
    tax,
    netBuyPrice,
  ]);

  useEffect(() => {
    if(firstLoad) {
      setFirstLoad(false);
      return;
    }
    const earning = sellPrice - totalCosts;
    const margin = roundToFourDecimals(earning / sellPrice) * 100;
    const roi = roundToFourDecimals(earning / netBuyPrice) * 100;
    setRoi(roi);
    setMargin(margin);
    setEarnings(earning);
    // if (product.asin === "B0C5QWYNVH") {
    //   console.log("tax:", tax);
    //   console.log("earning / netBuyPrice:", earning / netBuyPrice);
    //   console.log("earning / sellPrice:", earning / sellPrice);
    //   console.log("totalCosts:", totalCosts);
    //   console.log("netBuyPrice:", netBuyPrice);
    //   console.log("sellPrice:", sellPrice);
    //   console.log("content window factor:", factor);
    //   console.log("cal earning:", earning, "ist", earnings);
    //   console.log("cal margin:", margin, "ist", _margin);
    //   console.log("content window roi:", roi);
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fba,
    prepCenterCosts,
    transport,
    storageCosts,
    sellPrice,
    netBuyPrice
  ]);

  return (
    <div className="w-96 relative">
      <div className="px-10">
        <div className="-top-8 right-0 absolute">
          <Checkbox
            
            defaultChecked={fba}
            onChange={(e) => {
              if (e.target.checked) {
                setFba(true);
              } else {
                setFba(false);
              }
            }}
          >Mit FBA</Checkbox>
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
        <InputNumber
          value={sellPrice}
          step={0.01}
          stringMode
          decimalSeparator=","
          onChange={(e) => {
            if (e) {
              const parsed = parseFloat(e.toString().replaceAll(",", "."));
              setSellPrice(parsed);
              setCosts({
                ...costs,
                azn: parsed / multiplier,
              });
            }
          }}
          addonBefore="Verkaufspreis € (Brutto)"
        />
        <h3 className="font-semibold leading-6 mb-1 mt-2 text-gray-dark flex flex-row space-x-1 items-center">
          <div className="flex flex-row w-full">
            <p>Amazon Gebühren:</p>
            <p className="ml-auto">
              {formatter.format(costs.azn + costs.varc)}
            </p>
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
            <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
              <div className="flex flex-row w-full">
                <p>Versandkosten:</p>
                <p className="ml-auto">{formatter.format(costs.tpt)}</p>
              </div>
            </h3>
            <h3 className="font-semibold leading-6 mb-1 mt-2 text-gray-dark flex flex-row space-x-1 items-center">
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
            <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
              <InputNumber
                value={transport}
                onChange={(e) => {
                  if (e) {
                    const parsed = parseFloat(
                      e.toString().replaceAll(",", ".")
                    );
                    setTransportCosts(parsed);
                  }
                }}
                stringMode
                decimalSeparator=","
                step={0.01}
                addonBefore="Versandkosten €"
              />
            </h3>
            <h3 className="font-semibold leading-6 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
              <InputNumber
                value={storageCosts}
                onChange={(e) => {
                  if (e) {
                    const parsed = parseFloat(
                      e.toString().replaceAll(",", ".")
                    );
                    setStorageCosts(parsed);
                  }
                }}
                stringMode
                decimalSeparator=","
                step={0.01}
                addonBefore="Lagerkosten €"
              />
            </h3>
          </>
        )}
        
        <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
          <div className="flex flex-row w-full">
            <p>Sonstige Kosten:</p>
            <p className="ml-auto">{formatter.format(tax + netBuyPrice)}</p>
          </div>
        </h3>
        <div className="grid grid-rows-2 gap-1">
          <div className="flex flex-row">
            <p>Geschätze Umsatzsteuer ({product.tax} %):</p>
            <p className="ml-auto">{formatter.format(Number(tax))}</p>
          </div>
          <InputNumber
            value={roundToTwoDecimals(netBuyPrice)}
            decimalSeparator=","
            onChange={(e) => {
              if (e) {
                const parsed = parseFloat(e.toString().replaceAll(",", "."));
                setNetBuyPrice(parsed * factor);
              }
            }}
            stringMode
            addonBefore="Einkaufspreis € (Netto)"
          />
          <h3 className="leading-6 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
            <InputNumber
              value={prepCenterCosts}
              className="w-full"
              decimalSeparator=","
              onChange={(e) => {
                if (e) {
                  const parsed = parseFloat(e.toString().replaceAll(",", "."));
                  setPrepCenterCosts(parsed);
                }
              }}
              stringMode
              step={0.01}
              addonBefore="Prepcenter €"
            />
          </h3>
        </div>
        <div className="w-full flex flex-col">
          <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
            <div className="flex flex-row w-full">
              <p>Nettogewinn:</p>
              <p
                className={`ml-auto ${
                  earnings < 0 ? "text-red" : "text-green"
                }`}
              >
                {formatter.format(earnings)}
              </p>
            </div>
          </h3>
          <h3 className="font-semibold leading-6 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
            <div className="flex flex-row w-full">
              <p>ROI (Netto):</p>
              <p className={`ml-auto ${roi < 0 ? "text-red" : "text-green"}`}>
                {appendPercentage(roi)}
              </p>
            </div>
          </h3>
          <h3 className="font-semibold leading-6 mb-1 text-gray-dark flex flex-row space-x-1 items-center">
            <div className="flex flex-row w-full">
              <p>Nettomarge:</p>
              <p
                className={`ml-auto ${
                  earnings < 0 ? "text-red" : "text-green"
                }`}
              >
                {appendPercentage(margin)}
              </p>
            </div>
          </h3>
          {!isFlip && (
            <div className="ml-auto">
              <ArbitrageOneExportBtn
                source_price_calculated_net={1}
                product={{
                  asin,
                  a_prc: sellPrice,
                  lnk: product.lnk!,
                  prc: netBuyPrice,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentMarge;
