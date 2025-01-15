import { GridColDef } from "@mui/x-data-grid-premium";
import { Tooltip } from "antd";
import React from "react";
import {
  CheckIcon,
  CloudIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const wholesaleStatus = (status: string) => {
  switch (status) {
    case "complete":
      return {
        color: "green",
        icon: <CheckIcon fontSize={16} />,
        title: "Vollständig",
      };
    case "incomplete":
      return {
        color: "blue",
        icon: <ArrowPathIcon color={'blue'} fontSize={16} />,
        title: "In Bearbeitung",
      };
    case "not found":
      return {
        color: "gray",
        icon: <XMarkIcon color={'gray'} fontSize={16} />,
        title: "Nicht gefunden",
      };
    default:
      return {
        color: "red",
        icon: <CloudIcon  fontSize={16} />,
        title: "Warten auf Bearbeitung",
      };
  }
};

const WholeSaleStatus = ({ target }: { target: string }): GridColDef<any> => {
  return {
    field: `${target}_status`,
    disableColumnMenu: true,
    headerName: "Status",
    renderCell: (params) => {
      const status = wholesaleStatus(params.value);
      return (
        <div className="text-green font-semibold h-8 w-8">
          <Tooltip title={status.title}>{status.icon}</Tooltip>
        </div>
      );
    },
  };
};

export default WholeSaleStatus;
