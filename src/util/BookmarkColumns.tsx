import { GridColDef } from "@mui/x-data-grid-premium";
import { Settings } from "@/types/Settings";
import { BookMarkProduct } from "@/types/Product";
import { Checkbox } from "antd";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { UseMutateFunction } from "@tanstack/react-query";
import { ProductPagination } from "@/hooks/use-products";
import InfoField from "@/components/columns/InfoField";
import MarginPct from "@/components/columns/MarginPct";
import Margin from "@/components/columns/Margin";
import VKPrice from "@/components/columns/VKPrice";
import EKPrice from "@/components/columns/EKPrice";
import PriceAnalysis from "@/components/columns/PriceAnalysis";

export const bookMarkColumns: (
  target: string,
  settings: Settings,
  pagination: ProductPagination,
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
) => GridColDef<BookMarkProduct>[] = (
  target,
  settings,
  pagination,
  addBookmark,
  removeBookmark,
  userRoles
) => {
  return [
    {
      field: "nm",
      headerName: "Produkte",
      flex: 0.75,
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
    {
      field: "isBookmarked",
      headerName: "Gemerkt",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Checkbox
          checked={params.row.isBookmarked}
          onChange={(e) => {
            if (e.target.checked) {
              addBookmark({
                body: {
                  target: target,
                  shop: params.row.shop,
                  productId: params.row._id,
                },
                page: pagination.page,
                pageSize: pagination.pageSize,
              });
            } else {
              removeBookmark({
                body: {
                  target: target,
                  shop: params.row.shop,
                  productId: params.row._id,
                },
                page: pagination.page,
                pageSize: pagination.pageSize,
              });
            }
          }}
        />
      ),
    },
  ];
};
