import { Tooltip } from "antd";
import React from "react";
import { Button } from "./Button";
import { arbitrageOneUrlBuilder } from "@/util/arbitrageOneUrlBuilder";
import { ModifiedProduct } from "@/types/Product";
import Image from "next/image";
import arbitrageOne from "@/images/arbitrageone.png";
import arbitrageOneDark from "@/images/arbitrageone-dark.png";
import { useThemeAtom } from "@/hooks/use-theme";

const ArbitrageOneExportBtn = ({
  product,
  source_price_calculated_net,
}: {
  product: Pick<
    ModifiedProduct,
    "asin" | "a_prc" | "prc" | "lnk" | "a_avg_prc" | "asin" | "shop"
  >;
  source_price_calculated_net: number;
}) => {
  const [{ mode }, setApperance] = useThemeAtom(); 
  const { asin, a_prc, lnk, prc, a_avg_prc, shop } = product;

  const flip = shop === "flip";

  const defaultExport = {
    asin,
    source_price_calculated_net,
    sell_price: a_prc,
    source_price: prc,
    source_url: lnk,
    target_marketplace: "de",
  };

  const flipExport = {
    asin,
    source_price_calculated_net,
    sell_price: a_avg_prc!,
    source_price: a_prc!,
    source_url: "https://www.amazon.de/dp/" + asin,
    target_marketplace: "de",
  };

  return (
    <Tooltip
      color={"#11848d"}
      destroyTooltipOnHide
      title="Zu ArbitrageOne exportieren"
    >
      <Button
        className="w-32 h-10"
        variant="outline"
        target="_blank"
        href={arbitrageOneUrlBuilder(
          flip === true ? flipExport : defaultExport
        )}
      >
        <Image
          alt="ArbitrageOne logo"
          src={mode === "dark" ? arbitrageOneDark : arbitrageOne}
        />
      </Button>
    </Tooltip>
  );
};

export default ArbitrageOneExportBtn;
