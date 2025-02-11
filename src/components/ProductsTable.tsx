"use client";
import {
  DataGridPremium,
  GridSortModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { useMemo } from "react";
import Spinner from "./Spinner";
import useBookMarkAdd from "@/hooks/use-bookmark-add";
import { createColumns } from "@/util/ProductTableColumns";
import useBookMarkRemove from "@/hooks/use-bookmark-remove";
import useAccount from "@/hooks/use-account";
import { usePaginationAndSort } from "@/hooks/use-pagination-sort";
import { useUserSettings } from "@/hooks/use-settings";
import { useMarkSeen } from "@/hooks/use-markSeen";
import { UseQueryResult } from "@tanstack/react-query";
import { ModifiedProduct } from "@/types/Product";
import { DEFAULT_SORT } from "@/constant/constant";

export type ProductTableProps = {
  domain: string;
  target: string;
  className?: string;
  productCountQuery: UseQueryResult<
    {
      productCount: number;
    },
    Error
  >;
  productQuery: UseQueryResult<ModifiedProduct[], Error>;
};

export default function ProductsTable(props: ProductTableProps) {
  const [settings, setUserSettings] = useUserSettings();
  const { className, domain, target, productQuery, productCountQuery } = props;
  const [paginationModel, setPaginationModel, sortModel, setSortModel,handleSetSortModel ,handleSetPaginationModel] =
    usePaginationAndSort();

  const apiRef = useGridApiRef();
  useMarkSeen(apiRef, props);

  const user = useAccount();
  const userRoles = useMemo(() => user.data?.labels ?? [], [user.data?.labels]);

  const bookMarkMutation = useBookMarkAdd();
  const bookMarkDeleteMutation = useBookMarkRemove();

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length) {
      handleSetSortModel({
        field: model[0].field,
        sort: model[0].sort || DEFAULT_SORT,
      });
    } else {
      handleSetSortModel({
        field: "none",
        sort: DEFAULT_SORT,
      });
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
      getRowClassName={(params) => {
        return params.row.seen ? "opacity-50" : "";
      }}
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
      loading={productQuery.isLoading}
      pageSizeOptions={[10, 20, 50]}
      paginationModel={paginationModel}
      sortModel={[sortModel]}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      disableColumnMenu
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
