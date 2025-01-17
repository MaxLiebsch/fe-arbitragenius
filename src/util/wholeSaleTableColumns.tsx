import { Settings } from "@/types/Settings";
import { GridColDef } from "@mui/x-data-grid-premium";
import MarginPct from "@/components/columns/MarginPct";
import Margin from "@/components/columns/Margin";
import InfoField from "@/components/columns/InfoField";
import EKPrice from "@/components/columns/EKPrice";
import VKPrice from "@/components/columns/VKPrice";
import PriceAnalysis from "@/components/columns/PriceAnalysis";
import WholeSaleStatus from "@/components/columns/WholeSaleStatus";

export const createWholeSaleColumns: (
  target: string,
  settings: Settings
) => GridColDef[] = (target, settings) => [
  {
    field: "name",
    headerName: "Produkte",
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
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
  PriceAnalysis(),
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
  WholeSaleStatus({ target }),
];
