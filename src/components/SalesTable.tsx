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
import useBookMarkRemove from "@/hooks/use-bookmark-remove";
import useSalesCount from "@/hooks/use-sales-count";
import useSalesProducts from "@/hooks/use-sales-products";
import { createSalesTableColumns } from "@/util/SalesTableColumns";
import useAccount from "@/hooks/use-account";
import { usePaginationAndSort } from "@/hooks/use-pagination-sort";
import { useUserSettings } from "@/hooks/use-settings";
import { useMarkSeen } from "@/hooks/use-markSeen";
import { DEFAULT_SORT } from "@/constant/constant";

export default function SalesTable(props: {
  className?: string;
  target: string;
}) {
  const { className, target } = props;
  const [settings, setUserSettings] = useUserSettings();

  const {paginationModel, setPaginationModel, sortModel, setSortModel} =
    usePaginationAndSort();

  const apiRef = useGridApiRef();
  useMarkSeen(apiRef, { ...props, domain: "sales" });
  const user = useAccount();
  const userRoles = useMemo(() => user.data?.labels ?? [], [user.data?.labels]);

  const productCountQuery = useSalesCount(target);
  const productQuery = useSalesProducts(paginationModel, sortModel, target);

  const bookMarkMutation = useBookMarkAdd();
  const bookMarkDeleteMutation = useBookMarkRemove();

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length) {
      setSortModel({
        field: model[0].field,
        sort: model[0].sort ?? DEFAULT_SORT,
      });
    } else {
      setSortModel({field: "none", sort: DEFAULT_SORT});
    }
  };

  const columns = useMemo(
    () =>
      createSalesTableColumns(
        target,
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
      sortModel={[sortModel]} 
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
