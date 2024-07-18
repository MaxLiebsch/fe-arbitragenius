"use client";

import { ModifiedProduct } from "@/types/Product";
import { formatter } from "@/util/formatter";
import { Input, Popover, Switch } from "antd";
import React, { useMemo, useState } from "react";
import CopyToClipboard from "./CopyToClipboard";
import { ebayTier } from "@/constant/ebay";
import { Above, EbyTierCategory, UpTo } from "@/types/EbyTierCategory";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";
import { Settings } from "@/types/Settings";

const ContentEbyMarge = ({
  product,
  settings,
}: {
  settings: Settings;
  product: Pick<
    ModifiedProduct,
    | "ebyCategories"
    | "uprc"
    | "prc"
    | "eanList"
    | "esin"
    | "e_uprc"
    | "e_prc"
    | "e_qty"
    | "qty"
    | "tax"
    | "mnfctr"
    | "nm"
  >;
}) => {
  const factor = product.e_qty / product.qty;
  function findMappedCategory(categories: number[]): EbyTierCategory | null {
    let mappedCategory = null as EbyTierCategory | null;
    categories.forEach((x: number) => {
      const result = ebayTier.find(
        (tier: EbyTierCategory) => tier.id === x
      ) as EbyTierCategory;
      if (result) {
        mappedCategory = result;
      }
    });
    return mappedCategory;
  }

  function calculateFee(
    sellPrice: number,
    shopType: "no_shop" | "shop",
    mappedCategory: EbyTierCategory
  ) {
    const tiers = mappedCategory.tier[shopType];
    let fee = 0;

    for (let index = 0; index < tiers.length; index++) {
      const tier = tiers[index];
      if ("up_to" in tier && sellPrice <= tier.up_to!) {
        fee = sellPrice * tier.percentage;
      } else if ("above" in tier && sellPrice > tier.above!) {
        fee = sellPrice * tier.percentage;
      }
    }
    return roundToTwoDecimals(fee);
  }
  const mappedCategory = useMemo(
    () => findMappedCategory(product.ebyCategories.map((x) => x.id)),
    [product.ebyCategories]
  ) as EbyTierCategory | null;

  const [sellPrice, setSellPrice] = useState(product["e_uprc"]);
  const [ebyShop, setEbyshop] = useState<"shop" | "no_shop">("shop");
  const taxCosts = useMemo(
    () =>
      roundToTwoDecimals(
        sellPrice - sellPrice / (1 + (product.tax ? product.tax : 19) / 100)
      ),
    [sellPrice, product.tax]
  );
  const costs = useMemo(() => {
    if (mappedCategory === null) return 0;
    else return calculateFee(sellPrice, ebyShop, mappedCategory);
  }, [sellPrice, ebyShop, mappedCategory]);

  const [buyPrice, setBuyPrice] = useState(
    roundToTwoDecimals((product["prc"] / 1.19) * factor)
  );
  const [qty, setQty] = useState(1);
  const [storageCosts, setStorageCosts] = useState(settings.strg!);

  const [transportCosts, setTransportCosts] = useState(
    settings[settings.tptStandard as keyof Settings] as number
  );
  const earning =
    (sellPrice - costs - storageCosts - transportCosts - taxCosts - buyPrice) *
    qty;
  const margin =
    ((sellPrice - costs - storageCosts - transportCosts - taxCosts - buyPrice) /
      sellPrice) *
    100;

  const createSellprovisionStr = (tier: Above | UpTo) => {
    if ("above" in tier) {
      return `${roundToTwoDecimals(
        tier.percentage * 100
      )} % für jeden Anteil des Verkaufspreises über ${formatter.format(
        tier.above
      )}`;
    } else {
      return `${roundToTwoDecimals(
        tier.percentage * 100
      )} % für jeden Anteil des Verkaufspreises bis ${formatter.format(
        tier.up_to
      )}`;
    }
  };

  return (
    <div className="w-72 relative">
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
      <div className="-top-8 right-0 absolute">
        <Switch
          checkedChildren="Mit Shop"
          unCheckedChildren="Ohne Shop"
          defaultChecked
          onChange={(checked) => {
            if (checked) {
              setEbyshop("shop");
            } else {
              setEbyshop("no_shop");
            }
          }}
        />
      </div>
      <Input
        classNames={{ input: "!text-right" }}
        value={sellPrice}
        onChange={(e) => {
          setSellPrice(Number(e.target.value));
        }}
        type="number"
        addonBefore="Verkaufspreis € (Brutto)"
      />
      <h3 className="font-semibold leading-6 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
        <div className="flex flex-row w-full mt-3">
          <p>Ebay Gebühren:</p>
          <Popover
            placement="top"
            arrow={false}
            content={() => {
              if (mappedCategory === null) {
                return <div></div>;
              } else {
                const withShopAbove = mappedCategory.tier.shop.find(
                  (t) => "above" in t
                ) as { above: number; percentage: number };
                const withShopUpTo = mappedCategory.tier.shop.find(
                  (t) => "up_to" in t
                ) as { up_to: number; percentage: number };
                const withoutShopAbove = mappedCategory.tier.no_shop.find(
                  (t) => "above" in t
                ) as { above: number; percentage: number };
                const withoutShopUpTo = mappedCategory.tier.no_shop.find(
                  (t) => "up_to" in t
                ) as { up_to: number; percentage: number };
                return (
                  <div>
                    <div>
                      <span className="font-semibold">Kategorie:</span>
                      <span>
                        {product.ebyCategories.map((category: any) => {
                          return (
                            <span
                              className="mx-1"
                              key={category.number + category.category}
                            >
                              {category.category}
                              <span className="font-semibold"> ID: </span>
                              <CopyToClipboard text={category.id} />
                            </span>
                          );
                        })}
                      </span>
                    </div>
                    {ebyShop === "shop" ? (
                      <>
                        <h2 className="font-semibold">Mit Shop:</h2>
                        <div>{createSellprovisionStr(withShopUpTo)}</div>
                        <div>{createSellprovisionStr(withShopAbove)}</div>
                      </>
                    ) : (
                      <>
                        <h2 className="font-semibold">Ohne Shop:</h2>
                        <div>{createSellprovisionStr(withoutShopUpTo)}</div>
                        <div>{createSellprovisionStr(withoutShopAbove)}</div>
                      </>
                    )}
                  </div>
                );
              }
            }}
          >
            <p className="ml-auto cursor-pointer">{formatter.format(costs)}</p>
          </Popover>
        </div>
      </h3>
      <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
        <Input
          classNames={{ input: "!text-right" }}
          value={transportCosts}
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
      <h3 className="font-semibold leading-6 mt-2 mb-1 text-gray-900 flex flex-row space-x-1 items-center">
        <div className="flex flex-row w-full">
          <p>Sonstige Kosten:</p>
          <p className="ml-auto">{formatter.format(taxCosts + buyPrice)}</p>
        </div>
      </h3>
      <div className="grid grid-rows-2 gap-1">
        <div className="flex flex-row">
          <p>Geschätze Umsatzsteuer ({product.tax ?? 19} %):</p>
          <p className="ml-auto">{formatter.format(Number(taxCosts))}</p>
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
              {roundToTwoDecimals(margin)} %
            </p>
          </div>
        </h3>
      </div>
    </div>
  );
};

export default ContentEbyMarge;
