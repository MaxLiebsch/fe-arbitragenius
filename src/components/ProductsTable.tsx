"use client";
import {
  DataGridPremium,
  GridSortModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { useMemo, useState } from "react";
import useProductCount from "@/hooks/use-product-count";
import useProducts, {
  ProductPagination,
  ProductSort,
} from "@/hooks/use-products";
import Spinner from "./Spinner";
import { Settings } from "@/types/Settings";
import useBookMarkAdd from "@/hooks/use-bookmark-add";
import { createColumns } from "@/util/ProductTableColumns";
import useBookMarkRemove from "@/hooks/use-bookmark-remove";
import { usePagination } from "@/hooks/use-pagination";


export default function ProductsTable(props: {
  className?: string;
  domain: string;
  target: string;
  settings: Settings;
}) {
  const { className, domain, target, settings } = props;

  const [paginationModel, setPaginationModel] = usePagination();  

  const [sortModel, setSortModel] = useState<ProductSort>({
    field: `none`,
    direction: "desc",
  });

  const apiRef = useGridApiRef();

  const productCountQuery = useProductCount(domain, target, settings);
  const productQuery = useProducts(
    domain,
    paginationModel,
    sortModel,
    target,
    settings
  );

  const bookMarkMutation = useBookMarkAdd();
  const bookMarkDeleteMutation = useBookMarkRemove();

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
      createColumns(
        target,
        domain,
        paginationModel,
        settings,
        bookMarkMutation.mutate,
        bookMarkDeleteMutation.mutate
      ),
    [
      target,
      settings,
      paginationModel,
      domain,
      bookMarkMutation.mutate,
      bookMarkDeleteMutation.mutate,
    ]
  );

  return (
    <DataGridPremium
      apiRef={apiRef}
      className={className}
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
      rows={productQuery.data ?? []}
      rowCount={productCountQuery.data?.productCount ?? 0}
      loading={productQuery.isFetching}
      pageSizeOptions={[10, 20, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      pagination={true}
      localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
      getRowHeight={() => "auto"}
      sortingMode="server"
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
