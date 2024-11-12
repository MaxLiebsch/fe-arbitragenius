import React from "react";
import { GridColDef } from "@mui/x-data-grid-premium";
import KeepaGraphPopover from "../KeepaGraphPopover";

const PriceAnalysis = (): GridColDef<any> => {
  return {
    field: "analytics",
    disableColumnMenu: true,
    width: 150,
    headerName: "Preisanalyse",
    renderCell: (params) => (
      <KeepaGraphPopover product={params.row} /> 
    ),
  };
};

export default PriceAnalysis;
