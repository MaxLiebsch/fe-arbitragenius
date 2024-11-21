import React from "react";
import { GridColDef } from "@mui/x-data-grid-premium";
import KeepaGraphPopover from "../KeepaGraphPopover";
import { Tooltip } from "antd";

const PriceAnalysis = (): GridColDef<any> => {
  return {
    field: "analytics",
    disableColumnMenu: true,
    sortable: false,
    width: 150,
    renderHeader: (params) => (
      <Tooltip title="Graphik basierend auf Keepa Daten" placement="topLeft">
        <div>Preisanalyse</div>
      </Tooltip>
    ),
    renderCell: (params) => <KeepaGraphPopover product={params.row} />,
  };
};

export default PriceAnalysis;
