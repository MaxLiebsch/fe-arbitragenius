import { GridColDef } from "@mui/x-data-grid-premium";
import { Settings } from "@/types/Settings";
import { ModifiedProduct } from "@/types/Product";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { UseMutateFunction } from "@tanstack/react-query";
import { ProductPagination } from "@/hooks/use-products";
import React from "react";
import InfoField from "@/components/columns/InfoField";
import MarginPct from "@/components/columns/MarginPct";
import Margin from "@/components/columns/Margin";
import VKPrice from "@/components/columns/VKPrice";
import EKPrice from "@/components/columns/EKPrice";
import OptionField from "@/components/columns/OptionField";
import PriceAnalysis from "@/components/columns/PriceAnalysis";

export const createSalesTableColumns: (
  target: string,

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
  pagination,
  settings,
  addBookmark,
  removeBookmark,
  userRoles
) => [
  {
    field: "updatedAt",
    headerName: "Gelistet seit",
    width: 140,
    disableColumnMenu: true,
    renderCell: (params) => (
      <div>
        {new Date(params.row.updatedAt).toLocaleString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })}
      </div>
    ),
  },
  {
    field: "nm",
    headerName: "Produkte",
    disableColumnMenu: true,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <InfoField
        product={params.row}
        target={target}
        pagination={pagination}
        userRoles={userRoles}
      />
    ),
  },
  EKPrice({ settings }),
  VKPrice({ target, settings }),
  PriceAnalysis(),
  MarginPct({ target, settings }),
  Margin({ target, settings }),
  OptionField({
    addBookmark,
    removeBookmark,
    pagination,
    target,
    domain: "sales",
    flip: false,
  }),
];
