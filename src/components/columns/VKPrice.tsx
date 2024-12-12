import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { formatCurrency, formatter } from "@/util/formatter";
import { GridColDef } from "@mui/x-data-grid-premium";
import { Tooltip } from "antd";
import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { getAvg30Price, getAvgPrice } from "@/util/getAvgPrice";

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
  return {
    field: `${target}_prc`,
    width: 170,
    align: "left",
    headerAlign: "left",
    headerName: "Zielshoppreis",
    disableColumnMenu: true,
    renderHeader: (params) => {
      return (
        <div className="relative w-32 flex flex-col !leading-tight">
          <Tooltip title={`Verkaufspreis des Produktes und ${target === "a" ? (flip ? "" : "der statistischer Durchschnittspreis der letzten 30 Tage") : "der Medianpreis der verfügbaren Angebote"}`} placement="topLeft">
            <div>
              VK {target === "a" ? (flip ? "" : "(∅ 30 Tage)") : "(M Median)"}
            </div>
          </Tooltip>
          <div className="text-xs">
            <span className="text-green">{netto ? "Netto" : "Brutto"}</span>
          </div>
        </div>
      );
    },
    renderCell: (params) => {
      const { row: product } = params;
      const { a_prc, a_avg_prc, e_prc, shop, a_useCurrPrice, avg30_ahsprcs } =
        product;
      const displayAvgPrice = getAvg30Price(product as ModifiedProduct);
      let avgPrice = 0;
      if (a_useCurrPrice === false) {
        avgPrice = getAvgPrice(product as ModifiedProduct);
      } else {
        avgPrice = a_avg_prc;
      }

      const priceForCalculation =
        flip || shop === "flip" || a_useCurrPrice === false ? avgPrice : a_prc;

      let dumping = false;

      if (avgPrice && avgPrice > -1 && priceForCalculation) {
        if (
          avgPrice - priceForCalculation > 3 ||
          avgPrice / priceForCalculation > 1.03
        ) {
          dumping = true;
        }
      }
      const median = product["e_pRange"]?.median;
      const min = product["e_pRange"]?.min;
      const max = product["e_pRange"]?.max;
      const targetQty = product[`${target}_qty` as keyof ModifiedProduct];
      const targetUprc = product[`${target}_uprc` as keyof ModifiedProduct];
      return (
        <div className="flex flex-col">
          {dumping && !flip ? (
            <div className="text-blue-600 dark:text-blue=300 flex flex-row items-center gap-1">
              <span className="h-6 w-6">
                <ExclamationCircleIcon />
              </span>
              <span>Preis-Dumping</span>
            </div>
          ) : (
            <></>
          )}
          <div className={`${netto ? "" : "font-semibold text-green"}`}>
            <span>
              {formatCurrency(
                parseFloat(flip || shop === "flip" ? avgPrice : params.value)
              )}{" "}
            </span>
            {(target === "a" && !flip) || a_useCurrPrice === false ? (
              avgPrice && avgPrice > 1 ? (
                <span>{`(∅ ${formatter.format(avgPrice)})`} </span>
              ) : (
                <span>{`(∅ ${formatter.format(displayAvgPrice)})`} </span>
              )
            ) : null}
            {median && target === "e" ? (
              <span>{`(M ${formatter.format(median)})`} </span>
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
                parseFloat(target === "a" ? priceForCalculation : e_prc),
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
