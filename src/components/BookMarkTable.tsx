"use client";
import {
  DataGridPremium,
  GridSortModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { useMemo, useState } from "react";
import { ProductPagination, ProductSort } from "@/hooks/use-products";
import Spinner from "./Spinner";
import useBookMarkAdd from "@/hooks/use-bookmark-add";
import useBookMarkRemove from "@/hooks/use-bookmark-remove";
import { BookMarkProduct } from "@/types/Product";
import { bookMarkColumns } from "@/util/BookmarkColumns";
import { Settings } from "@/types/Settings";

export default function BookmarkTable(props: {
  products: BookMarkProduct[];
  target: string;
  loading: boolean;
}) {
  const { target, loading, products } = props;
  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: 20,
  });
  const [sortModel, setSortModel] = useState<ProductSort>({
    field: `none`,
    direction: "desc",
  });

  const apiRef = useGridApiRef();

  const addBookMark = useBookMarkAdd();
  const removeBookmark = useBookMarkRemove();

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length) {
      setSortModel({
        field: model[0].field,
        direction: model[0].sort ?? "asc",
      });
    } else {
      setSortModel(undefined);
    }
  };

  const columns = useMemo(
    () =>
      bookMarkColumns(
        target,
        { netto: true } as Settings,
        paginationModel,
        addBookMark.mutate,
        removeBookmark.mutate
      ),
    [removeBookmark.mutate, addBookMark.mutate, paginationModel, target]
  );

  return (
    <DataGridPremium
      apiRef={apiRef}
      sortingOrder={["desc", "asc"]}
      initialState={{
        columns: {
          columnVisibilityModel: {
            bsr: target === "a" ? true : false,
            analytics: target === "a" ? true : false,
            asin: target === "a" ? true : false,
          },
        },
      }}
      getRowId={(row) => row._id}
      columns={columns}
      rows={products}
      loading={loading}
      pageSizeOptions={[10, 20, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pagination={true}
      localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
      getRowHeight={() => "auto"}
      sx={{
        // disable cell selection style
        ".MuiDataGrid-cell:focus": {
          outline: "none",
        },
        // pointer cursor on ALL rows
        "& .MuiDataGrid-row:hover": {
          cursor: "pointer",
        },
      }}
      onSortModelChange={handleSortModelChange}
      experimentalFeatures={{ columnGrouping: true }}
      slots={{
        loadingOverlay: () => (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner />
          </div>
        ),
      }}
    />
  );
}
