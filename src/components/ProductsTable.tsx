"use client";
import {
  DataGridPremium,
  GridSortModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { useEffect, useMemo, useRef } from "react";
import useProductCount from "@/hooks/use-product-count";
import useProducts from "@/hooks/use-products";
import Spinner from "./Spinner";
import useBookMarkAdd from "@/hooks/use-bookmark-add";
import { createColumns } from "@/util/ProductTableColumns";
import useBookMarkRemove from "@/hooks/use-bookmark-remove";
import useAccount from "@/hooks/use-account";
import { usePaginationAndSort } from "@/hooks/use-pagination-sort";
import { useUserSettings } from "@/hooks/use-settings";
import { useProductSeen } from "@/hooks/use-productSeen";
import { CONSIDERED_SEEN_DWELL_DURANTION } from "@/constant/constant";

export default function ProductsTable(props: {
  className?: string;
  domain: string;
  target: string;
}) {
  const [settings, setUserSettings] = useUserSettings();
  const productSeen = useProductSeen(props);
  const { className, domain, target } = props;

  const rowVisted = useRef({
    _id: "",
    enter: new Date().getTime(),
  });

  const [paginationModel, setPaginationModel, sortModel, setSortModel] =
    usePaginationAndSort();

  const apiRef = useGridApiRef();
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.subscribeEvent("rowMouseEnter", (params) => {
        rowVisted.current = {
          _id: params.row._id,
          enter: new Date().getTime(),
        };
      });
      apiRef.current.subscribeEvent("rowMouseLeave", (params) => {
        if (
          new Date().getTime() - rowVisted.current.enter >
            CONSIDERED_SEEN_DWELL_DURANTION &&
          !params.row?.seen
        ) {
          productSeen.mutate(params.row._id);
          apiRef.current.updateRows([{ _id: params.row._id, seen: true }]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef]);

  const productCountQuery = useProductCount(domain, target);
  const productQuery = useProducts(domain, paginationModel, sortModel, target);
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
