import { Settings } from "@/types/Settings";
import { Popover } from "antd";
import React from "react";
import ContentMarge from "../ContentMarge";
import ContentEbyMarge from "../ContentEbyMarge";
import { formatCurrency } from "@/util/formatter";
import { GridColDef } from "@mui/x-data-grid-premium";

const Margin = ({
  target,
  settings,
  flip,
}: {
  target: string;
  flip?: boolean;
  settings: Settings;
}): GridColDef<any> => {
  const strg_1_hy = new Date().getMonth() < 9
  const isEurogram = !settings.euProgram ? "_p" : "";
  const isWinter = strg_1_hy ? "" : "_w";
  const isAzn = target === "a";
  return {
    field: `${target}${isEurogram}${isAzn && !flip ? isWinter : ""}_mrgn`,
    headerName: "Marge",
    renderHeader: (params) => (
      <div className="relative">
        <div>Marge</div>
      </div>
    ),
    renderCell: (params) => {
      const margin = parseFloat(params.value);
      return (
        <Popover
          placement="topLeft"
          arrow={false}
          content={
            params.row["costs"] && target === "a" ? (
              <ContentMarge product={params.row} />
            ) : (
              <ContentEbyMarge product={params.row} />
            )
          }
          title="Margenberechnung"
        >
          <div className="flex flex-col">
            <div
              className={`${
                settings.netto ? "" : "font-semibold text-green-600"
              }
              ${margin < 0 ? "text-red-600" : ""}
              `}
            >
              {formatCurrency(margin)}
            </div>
          </div>
        </Popover>
      );
    },
  };
};

export default Margin;
