import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { formatCurrency, formatter } from "@/util/formatter";
import { GridColDef } from "@mui/x-data-grid-premium";
import { Tooltip } from "antd";
import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { getAvgPrice } from "@/util/getAvgPrice";

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
            <div>
              VK {target === "a" ? (!flip ? "(∅ 30 Tage)" : "") : "(Median)"}
            </div>
          </Tooltip>
          <div className="text-xs">
            <span className="text-green-600">{netto ? "Netto" : "Brutto"}</span>
          </div>
        </div>
      );
    },
    renderCell: (params) => {
      const { row: product } = params;
      const {
        a_prc,
        a_avg_prc,
        e_prc,
        shop,
        a_useCurrPrice,
      } = product;
      let avgPrice = 0;
      if (!a_useCurrPrice) {
        avgPrice = getAvgPrice(product as ModifiedProduct);
      } else {
        avgPrice = a_avg_prc;
      }

      const price =
      flip || shop === "flip" || !a_useCurrPrice
      ? avgPrice
      : a_prc
    
      let dumping = false;

      if (avgPrice && avgPrice > -1 && price) {
        if (avgPrice - price > 3 || avgPrice / price > 1.03) {
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
            <span>{formatCurrency(parseFloat(target === 'a'?price: e_prc))} </span>
            {!flip || !a_useCurrPrice ? (
              target === "a" && avgPrice && avgPrice > 1 ? (
                <span>{`(∅ ${formatter.format(avgPrice)})`} </span>
              ) : median && target === "e" ? (
                <span>{`(${formatter.format(median)})`} </span>
              ) : null
            ) : null}
          </div>
          {targetQty > 1 && ( 
            <>
            <span className="text-xs">({formatCurrency(targetUprc)} / Stück)</span>
            <span className='text-xs'>{targetQty} Stück</span>
            </>
          )}
          <div className={`${netto ? "font-semibold text-green-600" : ""}`}>
            {formatCurrency(calculationDeduction(parseFloat(target === 'a'?price: e_prc), true))}
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
