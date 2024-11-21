import { ProductPagination } from "@/hooks/use-aznflips-products";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { GridColDef } from "@mui/x-data-grid-premium";
import { UseMutateFunction } from "@tanstack/react-query";
import { Checkbox, Tooltip } from "antd";
import React from "react";
import { Button } from "../Button";
import { arbitrageOneUrlBuilder } from "@/util/arbitrageOneUrlBuilder";
import Image from "next/image";
import ArbitrageOneExportBtn from "../ArbitrageOneExportBtn";

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
  domain: string;
  pagination: ProductPagination;
  flip: boolean;
}

const OptionField = ({
  addBookmark,
  removeBookmark,
  pagination,
  target,
  domain,
  flip,
}: OptionFieldProps): GridColDef<any> => {
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
      const { asin, a_prc, lnk, prc, tax } = product;
      return (
        <div className="flex flex-col justify-center gap-2">
          <Checkbox
            checked={params.row.isBookmarked}
            onChange={(e) => {
              if (e.target.checked) {
                addBookmark({
                  body: {
                    target: target,
                    shop: domain,
                    productId: params.row._id,
                  },
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                });
              } else {
                removeBookmark({
                  body: {
                    target: target,
                    shop: domain,
                    productId: params.row._id,
                  },
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                });
              }
            }}
          >
            Mein Deal
          </Checkbox>
          {asin && !flip && (
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
