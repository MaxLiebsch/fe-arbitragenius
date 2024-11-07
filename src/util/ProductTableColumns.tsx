import { GridColDef } from "@mui/x-data-grid-premium";
import { Settings } from "@/types/Settings";
import { KeepaGraph } from "../components/KeepaGraph";
import { ModifiedProduct } from "@/types/Product";
import { Checkbox, Tooltip } from "antd";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { UseMutateFunction } from "@tanstack/react-query";
import { ProductPagination } from "@/hooks/use-products";
import InfoField from "@/components/columns/InfoField";
import Margin from "@/components/columns/Margin";
import MarginPct from "@/components/columns/MarginPct";
import VKPrice from "@/components/columns/VKPrice";
import EKPrice from "@/components/columns/EKPrice";
import { Button } from "@/components/Button";
import Image from "next/image";
import arbitrageOne from "@/images/arbitrageone.png";
import { arbitrageOneUrlBuilder } from "./arbitrageOneUrlBuilder";
import OptionField from "@/components/columns/OptionField";

export const createColumns: (
  target: string,
  domain: string,
  pagination: ProductPagination,
  settings: Settings,
  addBookmark: UseMutateFunction<
    void,
    Error,
    {
      body: BookmarkSchema;
      page: number;
      pageSize: number;
    },
    unknown
  >,
  removeBookmark: UseMutateFunction<
    void,
    Error,
    {
      body: BookmarkDeleteSchema;
      page: number;
      pageSize: number;
    },
    void
  >,
  userRoles: string[]
) => GridColDef<ModifiedProduct>[] = (
  target,
  domain,
  pagination,
  settings,
  addBookmark,
  removeBookmark,
  userRoles
) => {
  const flip = domain === "flip";
  return [
    {
      field: "nm",
      headerName: "Produkte",
      flex: 0.65,
      renderCell: (params) => (
        <InfoField
          flip={flip}
          userRoles={userRoles}
          product={params.row}
          target={target}
          pagination={pagination}
        />
      ),
    },
    EKPrice({ settings, flip }),
    VKPrice({ target, settings, flip }),
    {
      field: "analytics",
      disableColumnMenu: true,
      width: 150,
      headerName: "Preisanalyse",
      renderCell: (params) => <KeepaGraph product={params.row} />,
    },
    MarginPct({ target, settings, flip }),
    Margin({ target, settings, flip }),
    OptionField({
      addBookmark,
      removeBookmark,
      pagination,
      target,
      domain,
      flip,
    }),
  ];
};
