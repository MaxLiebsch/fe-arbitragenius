import { Settings } from "@/types/Settings";
import React from "react";
import { GridColDef } from "@mui/x-data-grid-premium";
import { mrgnFieldName } from "@/util/productQueries/mrgnProps";
import MarginPopover from "../MarginPopover";

const Margin = ({
  target,
  settings,
  flip,
}: {
  target: string;
  flip?: boolean;
  settings: Settings;
}): GridColDef<any> => {
  return {
    field: mrgnFieldName(target, settings.euProgram),
    headerName: "Marge",
    renderHeader: (params) => (
      <div className="relative">
        <div>Marge</div>
      </div>
    ),
    renderCell: (params) => (
      <MarginPopover product={params.row} target={target} settings={settings} />
    ),
  };
};

export default Margin;
