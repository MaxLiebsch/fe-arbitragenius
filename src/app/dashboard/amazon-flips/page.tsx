"use client";
import Spinner from "@/components/Spinner";
import useAccount from "@/hooks/use-account";
import useAznFlipsCount from "@/hooks/use-aznflips-count";
import useAznFlipsProducts from "@/hooks/use-aznflips-products";
import useBookMarkAdd from "@/hooks/use-bookmark-add";
import useBookMarkRemove from "@/hooks/use-bookmark-remove";
import { usePaginationAndSort } from "@/hooks/use-pagination";
import { useUserSettings } from "@/hooks/use-settings";
import { createColumns } from "@/util/ProductTableColumns";
import {
  DataGridPremium,
  deDE,
  GridSortModel,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import Title from "antd/es/typography/Title";
import React, { useMemo } from "react";

const Page = () => {
  const target = "a";
  const domain = "flip";
  const [settings, setUserSettings] = useUserSettings();
  const targetEnabled =
    settings &&
    settings.targetPlatforms &&
    settings.targetPlatforms.includes(target);
  const [paginationModel, setPaginationModel, sortModel, setSortModel] =
    usePaginationAndSort();
  const apiRef = useGridApiRef();
  const user = useAccount();
  const userRoles = useMemo(() => user.data?.labels ?? [], [user.data?.labels]);

  const productCountQuery = useAznFlipsCount(target);
  const productQuery = useAznFlipsProducts(paginationModel, sortModel, target);

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
    <div className="h-full relative">
      <Title>Amazon Flips (Beta)</Title>
      <div className="absolute text-gray-dark text-xs right-0 top-[3.15rem]">
        Amazon Flips befindet sich im Beta-Status. Angebote können sehr schnell varieren. Es können Probleme bei der Margenberechnung auftreten.
      </div>
      <div className="flex h-[calc(100vh-198px)]">
        {targetEnabled ? (
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
        ) : (
          <div>Aktiviere Amazon in den Profileinstellungen</div>
        )}
      </div>
    </div>
  );
};

export default Page;
