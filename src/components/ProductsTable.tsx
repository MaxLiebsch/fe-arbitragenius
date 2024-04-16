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
        <div className="leading-2">{name ? name : "Visit"}</div>
      </Link>
    );
  } else {
    return <></>;
  }
};

const columns: (target: string) => GridColDef[] = (target) => [
  { field: "mnfctr", headerName: "Hersteller", width: 100 },
  {
    field: "nm",
    headerName: "Name",
    width: 300,
    renderCell: (params) => LinkWrapper(params.row.lnk, params.row.nm),
  },
  {
    field: "ctgry",
    width: 150,
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
    width: 80,
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: `${target}_mrgn_pct`,

    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: `${target}_mrgn`,

    headerName: "Marge",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: `${target}_prc`,

    headerName: "Preis",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: `${target}_img`,

    headerName: "Produktbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.a_img),
  },
  {
    field: `${target}_nm`,

    headerName: "Name",
    flex: 0.5,
    renderCell: (params) =>
      LinkWrapper(params.row[`${target}_lnk`], params.row[`${target}_nm`]),
  },
  {
    field: `a_bsr`,
    headerName: "BSR",
    renderCell: (params) => (
      <Image src={ComingSoon} alt="coming-soon" width={120} height={70} />
    ),
  },
  // { field: `${target}_fat`, headerName: "Profitable" },
];

export default function ProductsTable(props: {
  className?: string;
  domain: string;
  target: string;
}) {
  const { className, domain, target } = props;
  const prefix = target === "a" ? "a_" : "e_";
  const name = target === "a" ? "Amazon" : "Ebay";

  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: 20,
  });
  const [sortModel, setSortModel] = useState<ProductSort>({
    field: `${target}_mrgn_pct`,
    direction: "desc",
  });

  const apiRef = useGridApiRef();

  const shopQuery = useShop(domain);
  const productCountQuery = useProductCount(domain, target);
  const productQuery = useProducts(domain, paginationModel, sortModel, target);

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
            a_bsr: target === "a" ? true : false,
          },
        },
      }}
      getRowId={(row) => row._id}
      columns={columns(target)}
      rows={productQuery.data ?? []}
      rowCount={productCountQuery.data}
      loading={productQuery.isFetching}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      pagination={true}
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
