"use client";
import {
  DataGridPremium,
  GridColDef,
  GridSortModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import React, { useMemo, useState } from "react";
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
import { KeepaGraph, createUnixTimeFromKeepaTime } from "./KeepaGraph";
import { BSR, CategoryTree, ModifiedProduct } from "@/types/Product";
import { fromUnixTime, parseISO } from "date-fns";
import CopyToClipboard from "./CopyToClipboard";

const createColumns: (
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
      const bsr = params.row["bsr"];
      if (bsr && bsr.length) {
        if (params.row["salesRanks"]) {
          const bsrLastUpdate = parseISO(bsr[0].createdAt).getTime();
          const salesRanksLastUpdate = parseISO(
            params.row["keepaUpdatedAt"]
          ).getTime();
          if (bsrLastUpdate < salesRanksLastUpdate && params.row['categoryTree']) {
            params.row.bsr = parseSalesRank(
              params.row["salesRanks"],
              params.row["categoryTree"]
            );
          }
        }
      }
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
               <CopyToClipboard text={params.row["asin"]}/>
              {params.row["buyBoxIsAmazon"] !== undefined && (
                <span>
                  {params.row["buyBoxIsAmazon"] ? (
                    <span>
                      <span className="font-semibold"> BuyBox:</span>
                      <span className="text-amazon"> Amazon</span>
                    </span>
                  ) : (
                    <span>
                      <span className="font-semibold"> BuyBox:</span>
                      <span className="text-green-600 font-medium">
                        {" "}
                        Seller
                      </span>
                    </span>
                  )}
                </span>
              )}
              {params.row["totalOfferCount"] !== undefined && (
                <span>
                  <span>
                    <span className="font-semibold"> Seller:</span>
                    {params.row["totalOfferCount"] ? (
                      <span className=""> {params.row["totalOfferCount"]}</span>
                    ) : (
                      "0"
                    )}
                  </span>
                </span>
              )}
            </div>
          )}
          <></>
          <>
            {target === "a" && params.row["bsr"] && params.row["bsr"].length ? (
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
            ) : (
              <></>
            )}
            {params.row["monthlySold"] && (
              <div className="flex flex-row gap-2">
                {/* eigene Reihe */}
                <span>
                  {params.row["monthlySold"] ? (
                    <span>
                      <span className="font-semibold">Monatliche Sales:</span>
                      <span className="text-md">
                        {" "}
                        {params.row["monthlySold"]}
                      </span>
                    </span>
                  ) : (
                    "Keine Sales verfügbar"
                  )}
                </span>
              </div>
            )}
          </>
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
      return params.row["ahstprcs"] ? (
        <KeepaGraph product={params.row} />
      ) : (
        <></>
      );
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

const parseSalesRank = (
  salesRanks: { [key: string]: number[] },
  categoryTree: CategoryTree[]
  ) => {
  const parsedSalesRank: BSR[] = [];
  Object.entries(salesRanks).forEach(([key, value]) => {
    const bsr = {
      number: 0,
      category: "",
      createdAt: "",
    };
    if(!categoryTree) return;

    const categoryName = categoryTree.find(
      (category) => category.catId === parseInt(key)
    );
    if (!categoryName) return;
    const rank = value[value.length - 1] != -1 ? value[value.length - 1] : value[value.length - 3];
    bsr.number = rank
    bsr.category = categoryName.name;
    bsr.createdAt = fromUnixTime(createUnixTimeFromKeepaTime(value[value.length -2])).toISOString()
    parsedSalesRank.push(bsr);
  });
  return parsedSalesRank;
};

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

  const columns = useMemo(() => createColumns(target, settings), [target, settings]);


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
