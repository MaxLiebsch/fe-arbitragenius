"use client";
import {
  DataGridPremium,
  GridSortModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { useMemo, useState } from "react";
import useProductCount from "@/hooks/use-product-count";
import useProducts from "@/hooks/use-products";
import Spinner from "./Spinner";
import useBookMarkAdd from "@/hooks/use-bookmark-add";
import { createColumns } from "@/util/ProductTableColumns";
import useBookMarkRemove from "@/hooks/use-bookmark-remove";
import useAccount from "@/hooks/use-account";
import { usePaginationAndSort } from "@/hooks/use-pagination";
import { useUserSettings } from "@/hooks/use-settings";

export default function ProductsTable(props: {
  className?: string;
  domain: string;
  target: string;
}) {
  const [settings, setUserSettings] = useUserSettings();
  const { className, domain, target } = props;

  const [paginationModel, setPaginationModel, sortModel, setSortModel] =
    usePaginationAndSort();

  const apiRef = useGridApiRef();

  const productCountQuery = useProductCount(domain, target);
  const productQuery = useProducts(
    domain,
    paginationModel,
    sortModel,
    target
  );
  const user = useAccount();
  const userRoles = useMemo(() => user.data?.labels ?? [], [user.data?.labels]);

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
        bookMarkDeleteMutation.mutate,
        userRoles
      ),
    [
      target,
      settings,
      paginationModel,
      domain,
      bookMarkMutation.mutate,
      bookMarkDeleteMutation.mutate,
      userRoles,
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
