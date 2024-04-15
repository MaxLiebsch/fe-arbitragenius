"use client";
import {
  DataGridPremium,
  GridCellParams,
  GridColDef,
  GridColumnVisibilityModel,
  GridSortModel,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import { MutableRefObject, useState } from "react";
import ImageRenderer from "./ImageRenderer";
import { appendPercentage, formatCurrency } from "@/util/formatter";
import Link from "next/link";
import useShop from "@/hooks/use-shop";
import useProductCount from "@/hooks/use-product-count";
import useProducts, {
  ProductPagination,
  ProductSort,
} from "@/hooks/use-products";
import Spinner from "./Spinner";
import ComingSoon from "@/images/coming_soon.jpg";
import Image from "next/image";
import { Button } from "@mui/material";
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/16/solid";

const LinkWrapper = (link: string | undefined, name?: string) => {
  if (link) {
    return (
      <Link href={link} target="_blank">
        {name ? name : "Visit"}
      </Link>
    );
  } else {
    return <></>;
  }
};

const columns: GridColDef[] = [
  { field: "mnfctr", headerName: "Hersteller", width: 120 },
  {
    field: "nm",
    headerName: "Name",
    width: 250,
    renderCell: (params) => LinkWrapper(params.row.lnk, params.row.nm),
  },
  {
    field: "ctgry",
    headerName: "Kategorie",
    renderCell: (params) => {
      if (typeof params.row.ctrgy === "string") {
        return <>{params.row.ctrgry}</>;
      } else if (Array.isArray(params.row.ctrgry)) {
        return <>{params.row.ctrgry.join(",")}</>;
      }
    },
  },
  {
    field: "img",
    headerName: "Produktbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.img),
  },
  {
    field: "prc",
    headerName: `Preis`,
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "a_nm",
    headerClassName: `bg-amazon`,
    headerName: "Name",
    width: 250,
    renderCell: (params) => LinkWrapper(params.row.a_lnk, params.row.a_nm),
  },
  {
    field: "a_shadow",
    headerClassName: `bg-amazon`,
    headerName: "",
    disableColumnMenu: true,

    sortable: false,
    resizable: false,
    width: 120,
  },
  {
    field: "a_img",
    headerClassName: `bg-amazon`,
    headerName: "Produktbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.a_img),
  },
  {
    field: "a_mrgn_pct",
    headerClassName: `bg-amazon`,
    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: "a_mrgn",
    headerClassName: `bg-amazon`,
    headerName: "Marge",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "a_bsr",
    headerClassName: `bg-amazon`,
    headerName: "BSR",
    renderCell: (params) => (
      <Image src={ComingSoon} alt="coming-soon" width={120} height={70} />
    ),
  },
  {
    field: "a_prc",
    headerClassName: `bg-amazon`,
    headerName: "Preis",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  { field: "a_fat", headerClassName: `bg-amazon`, headerName: "Profitable" },
  {
    field: "e_nm",
    headerClassName: "bg-ebay",
    headerName: "Name",
    width: 250,
    renderCell: (params) => LinkWrapper(params.row.e_lnk, params.row.e_nm),
  },
  {
    field: "e_shadow",
    headerClassName: "bg-ebay",
    headerName: "",
    disableColumnMenu: true,
    resizable: false,
    sortable: false,
    width: 120,
  },
  {
    field: "e_img",
    headerClassName: "bg-ebay",
    headerName: "Produktbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.e_img),
  },
  {
    field: "e_mrgn",
    headerClassName: "bg-ebay",
    headerName: "Marge",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "e_mrgn_pct",
    headerClassName: "bg-ebay",
    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: "e_prc",
    headerClassName: "bg-ebay",
    headerName: "Preis",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  { field: "e_fat", headerClassName: "bg-ebay", headerName: "Profitable" },
];

export default function ProductsTable(props: {
  className?: string;
  domain: string;
}) {
  const { className, domain } = props;
  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<ProductSort>({field: "a_mrgn_pct", direction: 'desc'});

  const apiRef = useGridApiRef();

  const shopQuery = useShop(domain);
  const productCountQuery = useProductCount(domain);
  const productQuery = useProducts(domain, paginationModel, sortModel);

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
        pinnedColumns: { left: ["mnfctr", "nm"] },
        columns: {
          columnVisibilityModel: {
            a_shadow: false,
            e_shadow: false,
          },
        },
      }}
      getRowId={(row) => row._id}
      columns={columns}
      rows={
        productQuery.data
          ? productQuery.data.map((product) => {
              // if (product?.a_mrgn_pct >= 150 || product?.a_mrgn_pct <= 0) {
              //   product.a_mrgn_pct = 0;
              //   product.a_mrgn = 0;
              //   product.a_prc = 0;
              //   product.a_fat = false;
              //   product.a_img = "";
              //   product.a_nm = "";
              //   product.a_lnk = "";
              // }
              // if (product?.e_mrgn_pct >= 150 || product?.e_mrgn_pct <= 0) {
              //   product.e_mrgn_pct = 0;
              //   product.e_mrgn = 0;
              //   product.e_prc = 0;
              //   product.e_fat = false
              //   product.e_img = "";
              //   product.e_nm = "";
              //   product.e_lnk = "";
              // }
              return product
            })
          : []
      }
      rowCount={productCountQuery.data}
      loading={productQuery.isFetching}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      pagination={true}
      getCellClassName={(params: GridCellParams<any, any, number>) => {
        if (params.field.startsWith("a_")) {
          return `bg-amazon`;
        }
        if (params.field.startsWith("e_")) {
          return "bg-ebay";
        }
        return "";
      }}
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
      onSortModelChange={ handleSortModelChange}
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={[
        {
          groupId: shopQuery.data?.ne ?? "Loading ...",
          children: [{ field: "nm" }, { field: "mnfctr" }, { field: "ctrgy" }],
        },
        {
          groupId: "Amazon",
          freeReordering: true,
          renderHeaderGroup: () => (
            <GroupHeader name="Amazon" apiRef={apiRef} />
          ),
          children: [
            { field: "a_bsr" },
            { field: "a_shadow" },
            { field: "a_img" },
            { field: "a_nm" },
            { field: "a_prc" },
            { field: "a_mrgn" },
            { field: "a_fat" },
            { field: "a_mrgn_pct" },
          ],
        },
        {
          groupId: "Ebay",
          freeReordering: true,
          renderHeaderGroup: () => <GroupHeader apiRef={apiRef} name="Ebay" />,
          children: [
            { field: "e_img" },
            { field: "e_shadow" },
            { field: "e_nm" },
            { field: "e_prc" },
            { field: "e_mrgn" },
            { field: "e_fat" },
            { field: "e_mrgn_pct" },
          ],
        },
      ]}
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
