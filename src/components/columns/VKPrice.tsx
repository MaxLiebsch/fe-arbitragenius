import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { formatCurrency, formatter } from "@/util/formatter";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";
import { GridColDef } from "@mui/x-data-grid-premium";
import { Tooltip } from "antd";
import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

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
          <Tooltip title="Verkaufspreis" placement="topLeft">
            <div>VK {target === "a" ? !flip ?"(∅ 30 Tage)": "" : "(Median)"}</div>
          </Tooltip>
          <div className="text-xs">
            <span className="text-green-600">{netto ? "Netto" : "Brutto"}</span>
          </div>
        </div>
      );
    },
    renderCell: (params) => {
      const { row: product, value } = params;
      const { avg30_ahsprcs, avg30_ansprcs, a_prc, a_avg_prc,e_prc } = product;

      const price = flip ? a_avg_prc : target === 'a' ? a_prc: e_prc;

      const avg = roundToTwoDecimals(
        (avg30_ahsprcs ? avg30_ahsprcs : avg30_ansprcs) / 100
      );

      let dumping = false;

      if (avg && avg > -1 && price) {
        if (avg - price > 3 || avg / price > 1.03) {
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
            <div className="text-blue-600  flex flex-row items-center gap-1">
              <span className="h-6 w-6">
                <ExclamationCircleIcon />
              </span>
              <span>Preis-Dumping</span>
            </div>
          ) : (
            <></>
          )}
          <div className={`${netto ? "" : "font-semibold text-green-600"}`}>
            <span>{formatCurrency(parseFloat(price))} </span>
            {!flip ? (target === "a" && avg && avg > 1 ? (
              <span>{`(${formatter.format(avg)})`} </span>
            ) : median && target === "e" ? (
              <span>{`(${formatter.format(median)})`} </span>
            ) : null):null}
          </div>
          {targetQty > 1 && (
            <span className="text-xs">({targetUprc} € / Stück)</span>
          )}
          <div className={`${netto ? "font-semibold text-green-600" : ""}`}>
            {formatCurrency(calculationDeduction(parseFloat(price), true))}
          </div>
          {target === "e" && min && max ? (
            <>
              <div className="text-xs text-gray-500">
                <span>Min: {formatter.format(min)}</span>
              </div>
              <div className="text-xs text-gray-500">
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
