import { GridColDef } from "@mui/x-data-grid-premium";
import { Settings } from "@/types/Settings";
import { BookMarkProduct } from "@/types/Product";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { UseMutateFunction } from "@tanstack/react-query";
import { ProductPagination } from "@/hooks/use-products";
import InfoField from "@/components/columns/InfoField";
import MarginPct from "@/components/columns/MarginPct";
import Margin from "@/components/columns/Margin";
import VKPrice from "@/components/columns/VKPrice";
import EKPrice from "@/components/columns/EKPrice";
import PriceAnalysis from "@/components/columns/PriceAnalysis";
import OptionField from "@/components/columns/OptionField";
import { format } from "date-fns";

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
      field: "bookmarkedAt",
      headerName: "Hinzugefügt",
      valueFormatter: (params) => {
        const date = new Date(params.value as string);
        return format(date, "dd.MM.yyyy HH:mm");
      },
    },
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
    OptionField({
      addBookmark,
      removeBookmark,
      pagination,
      target,
    }) 
  ];
};
