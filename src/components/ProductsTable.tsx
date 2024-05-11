"use client";
import {
  DataGridPremium,
  GridColDef,
  GridColumnVisibilityModel,
  GridSortModel,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { MutableRefObject, ReactNode, useState } from "react";
import ImageRenderer from "./ImageRenderer";
import { appendPercentage, formatCurrency } from "@/util/formatter";
import Link from "next/link";
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
import { prefixLink } from "@/util/prefixLink";
import usePreferences from "@/hooks/use-preferences";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";

const LinkWrapper = (
  link: string | undefined,
  name?: string,
  mnfctr?: string
): ReactNode => {
  const regexp = /https?:\/\/[^?#\n?]+(?:\?[^#\n?]+)?(?:#[^#\n?]+)?/;
  if (link) {
    const match = link.match(regexp);
    if (!match) return <></>;

    return (
      <Link
        href={match[0]}
        target="_blank"
        className="font-light hover:font-semibold"
      >
        <div className="leading-2">
          {mnfctr ? `${mnfctr} ` : ""}
          {name ? name : "Visit"}
        </div>
      </Link>
    );
  } else {
    return <></>;
  }
};

const columns: (target: string, settings: Settings) => GridColDef[] = (
  target,
  settings
) => [
  {
    field: "ctgry",
    flex: 0.24,
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
  // {
  //   field: "asin",
  //   headerName: `ASIN`,
  //   renderCell: (params) => {
  //     return <>{params.value}</>;
  //   },
  // },
  {
    field: "nm",
    headerName: "Info",
    flex: 0.8,
    renderCell: (params) => {
      return (
        <div className="flex flex-col divide-y p-1">
          <div>
            {LinkWrapper(params.row.lnk, params.row.nm, params.row.mnfctr)}
          </div>
          <div>
            Zielshop:
            {LinkWrapper(
              params.row[`${target}_lnk`],
              params.row[`${target}_nm`]
            )}
          </div>
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
    field: "img",
    headerName: "Produktbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) =>
      ImageRenderer(prefixLink(params.row.img, params.row.s)),
  },
  {
    field: `${target}_img`,

    headerName: "Zielshopbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) =>
      ImageRenderer(prefixLink(params.row.a_img, params.row.s)),
  },
  {
    field: "prc",
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
    field: `${target}_prc`,

    headerName: "Zielshoppreis",
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
    field: `${target}_mrgn_pct`,
    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: `${target}_mrgn`,
    headerName: "Marge",
    renderCell: (params) => (
      <div className="text-green-600 font-semibold">
        {formatCurrency(calculationDeduction(parseFloat(params.value), settings.netto))}
      </div>
    ),
  },
  // {
  //   field: `${target}_nm`,
  //   headerName: "Name",
  //   flex: 0.5,
  //   renderCell: (params) =>
  //     LinkWrapper(params.row[`${target}_lnk`], params.row[`${target}_nm`]),
  // },
  // {
  //   field: `bsr`,
  //   headerName: "BSR",
  //   renderCell: (params) => {
  //     if (params.row["bsr"]) {
  //       return (
  //         <div className="flex flex-col">
  //           {params.row["bsr"].map((bsr: any) => {
  //             return (
  //               <div key={bsr.number + bsr.category}>
  //                 Nr.{bsr.number.toLocaleString("de-DE")} in {bsr.category}
  //               </div>
  //             );
  //           })}
  //         </div>
  //       );
  //     }
  //     return (
  //       <Image src={ComingSoon} alt="coming-soon" width={120} height={70} />
  //     );
  //   },
  // },
];

export default function ProductsTable(props: {
  className?: string;
  domain: string;
  target: string;
  settings: Settings;
}) {
  const { className, domain, target, settings } = props;

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

  const productCountQuery = useProductCount(domain, target, settings);
  const productQuery = useProducts(
    domain,
    paginationModel,
    sortModel,
    target,
    settings
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
            bsr: target === "a" ? true : false,
            asin: target === "a" ? true : false,
          },
        },
      }}
      getRowId={(row) => row._id}
      columns={columns(target, settings)}
      rows={productQuery.data ?? []}
      rowCount={productCountQuery.data ?? 0}
      loading={productQuery.isFetching}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
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
