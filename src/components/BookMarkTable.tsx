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
import { BookMarkProduct, ModifiedProduct } from "@/types/Product";
import { bookMarkColumns } from "@/util/BookmarkColumns";
import { Settings } from "@/types/Settings";
import { usePaginationAndSort } from "@/hooks/use-pagination";
import useAccount from "@/hooks/use-account";
import { useUserSettings } from "@/hooks/use-settings";

export default function BookmarkTable(props: {
  products: BookMarkProduct[];
  target: string;
  loading: boolean;
}) {
  const { target, loading, products } = props;
  const [paginationModel, setPaginationModel, sortModel, setSortModel] =
    usePaginationAndSort();

  const apiRef = useGridApiRef();

  const addBookMark = useBookMarkAdd();
  const removeBookmark = useBookMarkRemove();
  const [settings] = useUserSettings();
  const user = useAccount();
  const userRoles = useMemo(() => user.data?.labels ?? [], [user.data?.labels]);

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length) {
      setSortModel({
        field: model[0].field ?? "bookmarkedAt",
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
        settings,
        paginationModel,
        addBookMark.mutate,
        removeBookmark.mutate,
        userRoles
      ),
    [
      removeBookmark.mutate,
      addBookMark.mutate,
      settings,
      paginationModel,
      target,
      userRoles,
    ]
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
          },
        },
      }}
      getRowId={(row) => row._id}
      columns={columns}
      rows={[...products].sort((a: BookMarkProduct, b: BookMarkProduct) => {
        if (a.bookmarkedAt && b.bookmarkedAt) {
          return a.bookmarkedAt > b.bookmarkedAt ? -1 : 1;
        } else {
          return 0;
        }
      })}
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
