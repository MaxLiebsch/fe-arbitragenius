"use client";
import {
  DataGridPremium,
  GridColDef,
  GridColumnVisibilityModel,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarExport,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { MutableRefObject, ReactNode, useState } from "react";
import { appendPercentage, formatCurrency } from "@/util/formatter";
import { ProductPagination, ProductSort } from "@/hooks/use-products";
import Spinner from "./Spinner";
import { Button } from "@mui/material";
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  EyeSlashIcon,
} from "@heroicons/react/16/solid";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { LinkWrapper } from "./LinkWrapper";
import useTaskProducts from "@/hooks/use-task-products";
import useTaskProductCount from "@/hooks/use-task-product-count";
import ImageRenderer from "./ImageRenderer";
import { prefixLink } from "@/util/prefixLink";

const columns: (target: string, settings: Settings) => GridColDef[] = (
  target,
  settings
) => [
  {
    field: "category",
    flex: 0.12,
    headerName: "Kategorie",
    renderCell: (params) => {
      if (typeof params.row.ctrgy === "string") {
        return <>{params.row.ctrgry}</>;
      } else if (Array.isArray(params.row.ctgry)) {
        return (
          <div className="flex flex-col">
            {params.row.ctgry.map((ctrgy: string, i: number) => (
              <div key={ctrgy + i}>{ctrgy}</div>
            ))}
          </div>
        );
      }
    },
  },
  {
    field: "reference",
    headerName: "Referenz",
    width: 150,
  },
  {
    field: `ean`,
    flex: 0.12,
    headerName: "EAN",
  },
  {
    field: "name",
    headerName: "Info",
    flex: 0.8,
    renderCell: (params) => {
      return (
        <div className="flex flex-col divide-y p-1">
          <div>{params.row.name}</div>
          {params.row[`a_lnk`] && (
            <div>
              Amazon:
              {LinkWrapper(params.row[`a_lnk`], params.row[`a_nm`])}
            </div>
          )}
          {target === "a" && params.row["bsr"] && params.row["bsr"].length ? (
            <div className="">
              <span className="font-semibold">BSR:</span>
              <span className="">
                {params.row["bsr"].map((bsr: any) => {
                  return (
                    <span className="mx-1" key={bsr.number + bsr.category}>
                      Nr.{bsr.number.toLocaleString("de-DE")} in {bsr.category}
                    </span>
                  );
                })}
              </span>
            </div>
          ) : (
            <></>
          )}
          {params.row["asin"] && params.row["asin"] !== "" && (
            <div>
              <span className="font-semibold">ASIN: </span>
              {params.row["asin"]}
            </div>
          )}
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: `Preis`,
    renderHeader: (params) => (
      <div className="relative">
        <div>Preis</div>
        <div className="absolute bottom-1 text-xs text-gray-500">
          {settings?.netto ? "Netto" : "Brutto"}
        </div>
      </div>
    ),
    width: 80,
    valueFormatter: (params) =>
      formatCurrency(
        calculationDeduction(parseFloat(params.value), settings.netto)
      ),
  },
  {
    field: `${target}_lnk`,
    headerName: "Amazon Link",
  },
  {
    field: `${target}_img`,
    headerName: "Amazon Bild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(prefixLink(params.row.a_img, "")),
  },
  {
    field: `${target}_prc`,
    headerName: "Amazon Preis",
    renderHeader: (params) => (
      <div className="relative">
        <div>Zielshoppreis</div>
        <div className="absolute bottom-1 text-xs">
          {settings?.netto ? "Netto" : "Brutto"}
        </div>
      </div>
    ),
    valueFormatter: (params) =>
      formatCurrency(
        calculationDeduction(parseFloat(params.value), settings.netto)
      ),
  },
  {
    field: "bsr_1",
    headerName: "BSR 1",
  },
  {
    field: "bsr_cat_1",
    headerName: "BSR 1 Kategorie",
  },
  {
    field: "bsr_2",
    headerName: "BSR 2",
  },
  {
    field: "bsr_cat_2",
    headerName: "BSR 2 Kategorie",
  },
  {
    field: "bsr_3",
    headerName: "BSR 3",
  },
  {
    field: "bsr_cat_3",
    headerName: "BSR 3 Kategorie",
  },
  {
    field: "asin",
    headerName: "Amazon ASIN",
  },
  {
    field: `${target}_mrgn_pct`,
    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: `${target}_mrgn`,
    headerName: "Marge €",
    renderCell: (params) => (
      <div
        className={`${
          params.value > 0 ? "text-green-600" : "text-red-600"
        } font-semibold`}
      >
        {formatCurrency(
          calculationDeduction(parseFloat(params.value), settings.netto)
        )}
      </div>
    ),
  },
  {
    field: `status`,
    headerName: "Status",
    renderCell: (params) => (
      <div className="text-green-600 font-semibold h-8 w-8">
        {params.value === "complete" ? (
          <CheckIcon fontSize={16} />
        ) : (
          <EyeSlashIcon fontSize={16} />
        )}
      </div>
    ),
  },
];

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
  settings: Settings;
}) {
  const { className, taskId, settings } = props;

  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: 20,
  });
  const [sortModel, setSortModel] = useState<ProductSort>({
    field: `none`,
    direction: "desc",
  });

  const apiRef = useGridApiRef();

  const productCountQuery = useTaskProductCount(taskId);
  const productQuery = useTaskProducts(taskId, paginationModel, sortModel);

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
            bsr_1: false,
            [`a_lnk`]: false,
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
      getRowId={(row) => row._id}
      columns={columns("a", settings)}
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
