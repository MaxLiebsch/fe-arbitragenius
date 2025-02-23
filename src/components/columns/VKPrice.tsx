import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { formatCurrency, formatter } from "@/util/formatter";
import { GridColDef } from "@mui/x-data-grid-premium";
import { Tooltip } from "antd";
import React from "react";
import { AZN_AVG_FLD_MAPPING } from "@/constant/constant";

const VKPrice = ({
  target,
  settings,
  flip,
}: {
  target: string;
  flip?: boolean;
  settings: Settings;
}): GridColDef<any> => {
  const { netto } = settings;
  const fieldName = target === "a" ? "a_prc" : "e_pRange.median";
  return {
    field: fieldName,
    width: 170,
    align: "left",
    headerAlign: "left",
    headerName: "Zielshoppreis",
    disableColumnMenu: true,
    renderHeader: (params) => {
      return (
        <div className="relative w-32 flex flex-col !leading-tight">
          <Tooltip
            title={`Verkaufspreis des Produktes und ${
              target === "a"
                ? flip
                  ? ""
                  : "der statistischer Durchschnittspreis"
                : "der Medianpreis der verfügbaren Angebote"
            }`}
            placement="topLeft"
          >
            <div>{target === "a" ? (flip ? "∅ VK" : "∅ VK") : "M Median VK"}</div>
          </Tooltip>
          <div className="text-xs">
            <span className="text-green">{netto ? "Netto" : "Brutto"}</span>
          </div>
        </div>
      );
    },
    renderCell: (params) => {
      const { row: product } = params;
      const { a_prc, buyBoxIsAmazon } = product;
      const displayAvgPrice = product["a_avg_price"];
      let aznAvgPrice = displayAvgPrice === 0 ? a_prc : displayAvgPrice;
      const median = product["e_pRange"]?.median;
      const min = product["e_pRange"]?.min;
      const max = product["e_pRange"]?.max;
      const targetQty = product[`${target}_qty` as keyof ModifiedProduct];
      const targetUprc = product[`${target}_uprc` as keyof ModifiedProduct];
      return (
        <div className="flex flex-col">
          <div className={`${netto ? "" : "font-semibold text-green"}`}>
            <span>
              {target === "a" ? formatCurrency(aznAvgPrice) : `M ${formatCurrency(median)}`}
            </span>
            {target === "a" ? (
              <div
                className={`text-xs ${
                  buyBoxIsAmazon ? "text-amazon" : "text-green"
                }`}
              >
                {
                  AZN_AVG_FLD_MAPPING[
                    product.a_avg_fld as keyof typeof AZN_AVG_FLD_MAPPING
                  ]
                }
              </div>
            ) : null}
          </div>
          {targetQty > 1 && (
            <>
              <span className="text-xs">
                ({formatCurrency(targetUprc)} / Stück)
              </span>
              <span className="text-xs">{targetQty} Stück</span>
            </>
          )}
          <div className={`${netto ? "font-semibold text-green" : ""}`}>
            {formatCurrency(
              calculationDeduction(
                parseFloat(target === "a" ? aznAvgPrice : median),
                true
              )
            )}
          </div>
          {target === "e" && min && max ? (
            <>
              <div className="text-xs text-gray">
                <span>Min: {formatter.format(min)}</span>
              </div>
              <div className="text-xs text-gray">
                <span>Max: {formatter.format(max)}</span>
              </div>
            </>
          ) : null}
        </div>
      );
    },
  };
};

export default VKPrice;
