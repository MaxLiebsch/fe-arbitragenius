import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { formatCurrency } from "@/util/formatter";
import { GridColDef } from "@mui/x-data-grid-premium";
import { Tooltip } from "antd";
import React from "react";

const EKPrice = ({
  settings,
  flip,
}: {
  settings: Settings;
  flip?: boolean;
}): GridColDef<any> => {
  const { netto } = settings;
  return {
    field: "prc",
    headerName: `Preis`,
    headerAlign: "left",
    disableColumnMenu: true,
    align: "left",
    renderHeader: (params) => (
      <div className="relative w-16 flex flex-col !leading-tight">
        <Tooltip title="Einkaufspreis des Produktes" placement="topLeft">
          <div>EK</div>
        </Tooltip>
        <div className="bottom-1 text-xs text-gray">
          <span className="text-green">{netto ? "Netto" : "Brutto"}</span>
        </div>
      </div>
    ),
    renderCell: (params) => {
      const { row: product, value } = params;
      const { qty, a_qty, uprc, a_prc, a_uprc, shop } = product;
      const price = flip || shop === "flip" ? a_prc : value;
      const uprice = flip || shop === "flip" ? a_uprc : uprc;
      const currQty = flip || shop === "flip" ? a_qty : qty;
      return (
        <div className="flex flex-col">
          <div className={`${netto ? "" : "font-semibold text-green"}`}>
            {formatCurrency(price)}
          </div>
          {currQty > 1 && (
            <>
            <span className="text-xs">({formatCurrency(uprice)} / Stück)</span>
            <span className="text-xs">{currQty} Stück</span>
            </>
          )}
          <div className={`${netto ? "font-semibold text-green" : ""}`}>
            {formatCurrency(calculationDeduction(price, true))}
          </div>
        </div>
      );
    },
    width: 120,
  };
};

export default EKPrice;
