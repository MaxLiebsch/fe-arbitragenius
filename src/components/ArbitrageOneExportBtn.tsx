import { Tooltip } from "antd";
import React from "react";
import { Button } from "./Button";
import { arbitrageOneUrlBuilder } from "@/util/arbitrageOneUrlBuilder";
import { ModifiedProduct } from "@/types/Product";
import Image from "next/image";
import arbitrageOne from "@/images/arbitrageone.png";

const ArbitrageOneExportBtn = ({
  product,
  source_price_calculated_net,
}: {
  product: Pick<ModifiedProduct, "asin" | "a_prc" | "prc" | "lnk">;
  source_price_calculated_net: number;
}) => {
  const { asin, a_prc, lnk, prc } = product;
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
        href={arbitrageOneUrlBuilder({
          asin,
          source_price_calculated_net,
          sell_price: a_prc,
          source_price: prc,
          source_url: lnk,
          target_marketplace: "de",
        })}
      >
        <Image alt="ArbitrageOne logo" src={arbitrageOne} />
      </Button>
    </Tooltip>
  );
};

export default ArbitrageOneExportBtn;
