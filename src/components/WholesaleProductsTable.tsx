"use client";
import {
  DataGridPremium,
  GridColumnVisibilityModel,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarExport,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { MutableRefObject, useState } from "react";
import Spinner from "./Spinner";
import { Button } from "@mui/material";
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/16/solid";
import useTaskProducts from "@/hooks/use-task-products";
import useTaskProductCount from "@/hooks/use-task-product-count";
import { createWholeSaleColumns } from "../util/wholeSaleTableColumns";
import { usePaginationAndSort } from "@/hooks/use-pagination-sort";
import { useUserSettings } from "@/hooks/use-settings";
import { WholeSaleTarget } from "@/types/tasks";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        printOptions={{ allColumns: true }}
        csvOptions={{ allColumns: true }}
        excelOptions={{ allColumns: true }}
      />
    </GridToolbarContainer>
  );
}

export default function WholeSaleProductsTable(props: {
  className?: string;
  taskId: string;
  target: WholeSaleTarget;
}) {
  const [settings, setUserSettings] = useUserSettings();
  const { className, taskId, target } = props;

  const [paginationModel, setPaginationModel, sortModel, setSortModel] =
    usePaginationAndSort();

  const apiRef = useGridApiRef();

  const productCountQuery = useTaskProductCount(taskId);
  const productQuery = useTaskProducts(
    taskId,
    paginationModel,
    sortModel,
    target
  );

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

  return (
    <DataGridPremium
      apiRef={apiRef}
      className={className}
      initialState={{
        columns: {
          columnVisibilityModel: {
            analytics: target === 'a',
            bsr_1: false,
            bsr_cat_1: false,
            bsr_2: false,
            bsr_cat_2: false,
            bsr_3: false,
            bsr_cat_3: false,
            asin: false,
          },
        },
      }}
      sortingOrder={["desc", "asc"]}
      localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
      getRowId={(row) => row._id}
      columns={createWholeSaleColumns(target, settings)}
      rows={productQuery.data ?? []}
      rowCount={productCountQuery.data ?? 0}
      loading={productQuery.isLoading}
      pageSizeOptions={[10, 20, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      disableRowSelectionOnClick
      pagination={true}
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
        toolbar: CustomToolbar,
        loadingOverlay: () => (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner />
          </div>
        ),
      }}
    />
  );
}

const GroupHeader = ({
  name,
  apiRef,
}: {
  name: string;
  apiRef: MutableRefObject<GridApiPremium>;
}) => {
  const [hidden, setHidden] = useState(false);
  const prefix = name.toLowerCase().slice(0, 1);
  return (
    <div className={`flex flex-row gap-1 items-center`}>
      <div>{name}</div>

      <Button
        variant="text"
        onClick={() => {
          if (!hidden) {
            apiRef.current.setColumnVisibility(`${prefix}_shadow`, true);
          } else {
            apiRef.current.setColumnVisibility(`${prefix}_shadow`, false);
          }
          const gridColModel = [
            "_bsr",
            "_img",
            "_nm",
            "_prc",
            "_rgn",
            "_mrgn_pct",
            "_mrgn",
            "_fat",
            "_pct",
          ].reduce<GridColumnVisibilityModel>((gridColModel, col) => {
            gridColModel[`${prefix}${col}`] = hidden;
            return gridColModel;
          }, {});
          const allColumns = apiRef.current.getAllColumns();
          const visibleColumns = apiRef.current.getVisibleColumns();
          const hiddenColumns = [
            ...allColumns.map((col) => {
              if (
                visibleColumns.find(
                  (visibleCol) => visibleCol.field === col.field
                ) === undefined
              ) {
                return col.field;
              }
            }, []),
          ]
            .filter((col) => col !== undefined)
            .reduce<GridColumnVisibilityModel>((gridColModel, col) => {
              gridColModel[`${col}`] = false;
              return gridColModel;
            }, {});

          apiRef.current.setColumnVisibilityModel({
            ...hiddenColumns,
            ...gridColModel,
          });
          setHidden(!hidden);
        }}
      >
        {hidden ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Button>
    </div>
  );
};
