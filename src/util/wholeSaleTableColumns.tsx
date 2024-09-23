import { Settings } from "@/types/Settings";

import CopyToClipboard from "../components/CopyToClipboard";
import { GridColDef } from "@mui/x-data-grid-premium";
import { CheckIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import MarginPct from "@/components/columns/MarginPct";
import Margin from "@/components/columns/Margin";
import InfoField from "@/components/columns/InfoField";
import EKPrice from "@/components/columns/EKPrice";
import VKPrice from "@/components/columns/VKPrice";
import { Tooltip } from "antd";

export const createWholeSaleColumns: (
  target: string,
  settings: Settings
) => GridColDef[] = (target, settings) => [
  {
    field: "category",
    headerName: "Kategorie",
    renderCell: (params) => {
      if (typeof params.row.ctrgy === "string") {
        return <>{params.row.ctrgry}</>;
      } else if (Array.isArray(params.row.ctgry)) {
        return (
          <div className="flex flex-col">
            {params.row.ctgry.map((ctrgy: string, i: number) => (
              <div key={ctrgy + i}>{ctrgy}</div>
            ))}
          </div>
        );
      }
    },
  },
  {
    field: "reference",
    headerName: "Referenz",
    width: 150,
  },
  {
    field: `ean`,
    headerName: "EAN",
    width: 150,
    renderCell: (params) => <CopyToClipboard text={params.row.ean} />,
  },
  {
    field: "name",
    headerName: "Info",
    flex: 1,
    renderCell: (params) => {
      return (
        <InfoField
          product={params.row}
          target={target}
          pagination={{ page: 1, pageSize: 1 }}
          userRoles={["user"]}
        />
      );
    },
  },
  EKPrice({ settings }),
  VKPrice({ target, settings }),
  {
    field: "bsr_1",
    headerName: "BSR 1",
  },
  {
    field: "bsr_cat_1",
    headerName: "BSR 1 Kategorie",
  },
  {
    field: "bsr_2",
    headerName: "BSR 2",
  },
  {
    field: "bsr_cat_2",
    headerName: "BSR 2 Kategorie",
  },
  {
    field: "bsr_3",
    headerName: "BSR 3",
  },
  {
    field: "bsr_cat_3",
    headerName: "BSR 3 Kategorie",
  },
  {
    field: "asin",
    headerName: "Amazon ASIN",
  },
  MarginPct({ target, settings }),
  Margin({ target, settings }),
  {
    field: `${target}_status`,
    headerName: "Status",
    renderCell: (params) => (
      <div className="text-green-600 font-semibold h-8 w-8">
        {params.value === "complete" ? (
          <Tooltip title="Vollständig">
            <CheckIcon fontSize={16} />
          </Tooltip>
        ) : (
          <Tooltip title="Unvollständig">
            <EyeSlashIcon fontSize={16} />
          </Tooltip>
        )}
      </div>
    ),
  },
];
