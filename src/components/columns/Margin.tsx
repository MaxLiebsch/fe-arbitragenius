import { Settings } from "@/types/Settings";
import React from "react";
import { GridColDef } from "@mui/x-data-grid-premium";
import { mrgnFieldName } from "@/util/productQueries/mrgnProps";
import MarginPopover from "../MarginPopover";
import { Tooltip } from "antd";

const Margin = ({
  target,
  settings,
}: {
  target: string;
  settings: Settings;
}): GridColDef<any> => {
  return {
    field: mrgnFieldName(target, settings.euProgram),
    renderHeader: (params) => (
      <div className="relative flex flex-col !leading-tight">
        <Tooltip title="Gewinn in Euro">
          <div>Gewinn</div>
        </Tooltip>
        <div className="text-xs">
          <span className="text-green">
            {settings.netto ? "Netto" : "Brutto"}
          </span>
        </div>
      </div>
    ),
    renderCell: (params) => (
      <MarginPopover product={params.row} target={target} settings={settings} />
    ),
  };
};

export default Margin;
