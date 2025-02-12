import { ProductPagination } from "@/hooks/use-aznflips-products";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { GridColDef } from "@mui/x-data-grid-premium";
import { UseMutateFunction } from "@tanstack/react-query";
import { Checkbox, Select, Tooltip } from "antd";
import React from "react";
import ArbitrageOneExportBtn from "../ArbitrageOneExportBtn";
import ProductInvalid from "../ProductInvalid";
import ProductIrrelevant from "../ProductIrrelevant";

interface OptionFieldProps {
  addBookmark: UseMutateFunction<
    void,
    Error,
    {
      body: BookmarkSchema;
      page: number;
      pageSize: number;
    },
    unknown
  >;
  removeBookmark: UseMutateFunction<
    void,
    Error,
    {
      body: BookmarkDeleteSchema;
      page: number;
      pageSize: number;
    },
    void
  >;
  target: string;
  pagination: ProductPagination;
}

const OptionField = ({
  addBookmark,
  removeBookmark,
  pagination,
  target,
}: OptionFieldProps): GridColDef<any> => {
  const  pathname = window.location.pathname;
  const isSearch = pathname === '/app/dashboard/search'
  return {
    field: "isBookmarked",
    renderHeader: (params) => (
      <Tooltip title="Export der Daten">
        <div>Optionen</div>
      </Tooltip>
    ),
    headerAlign: "center",
    sortable: false,
    width: 150,
    disableColumnMenu: true,
    align: "center",
    renderCell: (params) => {
      const product = params.row;
      const { asin, shop, isBookmarked, _id: productId } = product;
      return (
        <div className="flex flex-col justify-center gap-2">
          <Checkbox
            checked={isBookmarked}
            onChange={(e) => {
              if (e.target.checked) {
                addBookmark({
                  body: {
                    target: target,
                    shop,
                    search: isSearch,
                    productId,
                  },
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                });
              } else {
                removeBookmark({
                  body: {
                    target: target,
                    shop,
                    search: isSearch,
                    productId,
                  },
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                });
              }
            }}
          >
            Mein Deal
          </Checkbox>
          <ProductIrrelevant
            pagination={pagination}
            productId={productId}
            target={target}
            domain={shop}
          />
          <ProductInvalid
            pagination={pagination}
            productId={productId}
            target={target}
            domain={shop}
          />
          {asin && (
            <ArbitrageOneExportBtn
              product={product}
              source_price_calculated_net={0}
            />
          )}
        </div>
      );
    },
  };
};

export default OptionField;
