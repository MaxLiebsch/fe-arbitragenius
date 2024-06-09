"use client";
import {
  DataGridPremium,
  GridColDef,
  GridSortModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { useState } from "react";
import ImageRenderer from "./ImageRenderer";
import { appendPercentage, formatCurrency } from "@/util/formatter";
import useProductCount from "@/hooks/use-product-count";
import useProducts, {
  ProductPagination,
  ProductSort,
} from "@/hooks/use-products";
import Spinner from "./Spinner";
import { prefixLink } from "@/util/prefixLink";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { LinkWrapper } from "./LinkWrapper";
import { KeepaGraph } from "./KeepaGraph";
import { ModifiedProduct } from "@/types/Product";

const columns: (
  target: string,
  settings: Settings
) => GridColDef<ModifiedProduct>[] = (target, settings) => [
  {
    field: "ctgry",
    flex: 0.15,
    headerName: "Kategorie",
    renderCell: (params) => {
      if (typeof params.row.ctgry === "string") {
        return <>{params.row.ctgry}</>;
      } else if (Array.isArray(params.row.ctgry)) {
        return (
          <div className="flex flex-col">
            {params.row.ctgry.map((ctgry: string, i: number) => (
              <div key={ctgry + i}>{ctgry}</div>
            ))}
          </div>
        );
      }
    },
  },
  {
    field: "nm",
    headerName: "Info",
    flex: 0.75,
    renderCell: (params) => {
      return (
        <div className="flex flex-col divide-y p-1">
          <div>
            {LinkWrapper(params.row.lnk, params.row.nm, params.row.mnfctr)}
          </div>
          <div>
            Zielshop:
            {LinkWrapper(
              params.row[`${target}_lnk` as "a_lnk" | "e_lnk"],
              params.row[`${target}_nm` as "a_nm" | "e_nm"]
            )}
          </div>
          {params.row["asin"] && params.row["asin"] !== "" && (
            <div>
              <span className="font-semibold">ASIN: </span>
              {params.row["asin"]}
            </div>
          )}
          {target === "a" && params.row["bsr"] && params.row["bsr"].length ? (
            <>
              <div>
                <span className="font-semibold">BSR:</span>
                <span>
                  {params.row["bsr"].map((bsr: any) => {
                    return (
                      <span className="mx-1" key={bsr.number + bsr.category}>
                        Nr.{bsr.number.toLocaleString("de-DE")} in{" "}
                        {bsr.category}
                      </span>
                    );
                  })}
                </span>
              </div>
              {params.row["ahstprcs"] && (
                <div className="flex flex-row gap-2">
                  <span>
                    {params.row["buyBoxIsAmazon"]
                      ? "BuyBox ist Amazon"
                      : "BuyBox ist nicht Amazon"}
                  </span>
                  <span>
                    {params.row["stockBuyBox"]
                      ? "Lagerbestand BuyBox: " + params.row["stockBuyBox"]
                      : "Kein Lagerbestand BuyBox verfügbar"}
                  </span>
                  <span>
                    {params.row["stockAmount"]
                      ? "Lagerbestand: " + params.row["stockAmount"]
                      : "Kein Lagerbestand verfügbar"}
                  </span>
                  <span>
                    {params.row["numberOfItems"]
                      ? "Anzahl Artikel: " + params.row["numberOfItems"]
                      : "Keine Anzahl Artikel verfügbar"}
                  </span>
                  <span>
                    {params.row["monthlySold"]
                      ? "Monatlich verkauft: " + params.row["monthlySold"]
                      : "Keine Verkaufszahlen verfügbar"}
                  </span>
                  <span>
                    {params.row["totalOfferCount"]
                      ? "Anzahl Angebote: " + params.row["totalOfferCount"]
                      : "Keine Angebote verfügbar"}
                  </span>
                </div>
              )}
            </>
          ) : (
            <></>
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
    field: "analytics",
    headerName: "Preisanalyse",
    renderCell: (params) => {
      return params.row?.ahstprcs ? <KeepaGraph product={params.row} /> : <></>;
    },
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
        {formatCurrency(
          calculationDeduction(parseFloat(params.value), settings.netto)
        )}
      </div>
    ),
  },
];

export default function ProductsTable(props: {
  className?: string;
  domain: string;
  target: string;
  settings: Settings;
}) {
  const { className, domain, target, settings } = props;

  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: 20,
  });
  const [sortModel, setSortModel] = useState<ProductSort>({
    field: `none`,
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
      columns={columns(target, settings)}
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
