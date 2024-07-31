import ImageRenderer from "../components/ImageRenderer";
import { appendPercentage, formatCurrency, formatter } from "@/util/formatter";
import { GridColDef } from "@mui/x-data-grid-premium";
import { prefixLink } from "@/util/prefixLink";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { LinkWrapper } from "../components/LinkWrapper";
import { KeepaGraph } from "../components/KeepaGraph";
import { ModifiedProduct } from "@/types/Product";
import { parseISO } from "date-fns";
import CopyToClipboard from "../components/CopyToClipboard";
import { Checkbox, Popover, Tooltip } from "antd";
import ContentMarge from "../components/ContentMarge";
import ContentEbyMarge from "../components/ContentEbyMarge";
import Link from "next/link";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { UseMutateFunction } from "@tanstack/react-query";
import { parseSalesRank } from "./parseSalesRank";
import { ProductPagination } from "@/hooks/use-products";

export const createColumns: (
  target: string,
  domain: string,
  pagination: ProductPagination,
  settings: Settings,
  addBookmark: UseMutateFunction<
    void,
    Error,
    {
      body: BookmarkSchema;
      page: number;
      pageSize: number;
    },
    unknown
  >,
  removeBookmark: UseMutateFunction<
    void,
    Error,
    {
      body: BookmarkDeleteSchema;
      page: number;
      pageSize: number;
    },
    void
  >
) => GridColDef<ModifiedProduct>[] = (
  target,
  domain,
  pagination,
  settings,
  addBookmark,
  removeBookmark
) => [
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
          if (
            bsrLastUpdate < salesRanksLastUpdate &&
            params.row["categoryTree"] !== null
          ) {
            params.row.bsr = parseSalesRank(
              params.row["salesRanks"],
              params.row["categoryTree"]
            );
          }
        }
      }
      return (
        <div className="flex flex-col divide-y p-1">
          <div className={`${params.row["nm"]?.length < 114 && "flex gap-1"}`}>
            {LinkWrapper(params.row.lnk, params.row.nm, params.row.mnfctr)}
            {params.row[`qty` as "qty"] > 1 && (
              <div>({params.row[`qty` as "qty"]} Stück)</div>
            )}
          </div>
          <div>
            <div
              className={`${
                params.row[`${target}_nm` as "a_nm" | "e_nm"]?.length < 114 &&
                "flex gap-1"
              }`}
            >
              <span className="font-semibold">Ziel:</span>
              {LinkWrapper(
                params.row[`${target}_lnk` as "a_lnk" | "e_lnk"],
                params.row[`${target}_nm` as "a_nm" | "e_nm"]
              )}

              {params.row[`${target}_qty` as "a_qty" | "e_qty"] > 1 && (
                <div className="inline">
                  ({params.row[`${target}_qty` as "a_qty" | "e_qty"]} Stück)
                </div>
              )}
            </div>
          </div>
          {params.row["eanList"] && params.row["eanList"].length ? (
            <div className="flex flex-row gap-1">
              <span className="font-semibold">EAN:</span>
              <div className="flex flex-row gap-2">
                {params.row["eanList"].map((ean: string) => (
                  <CopyToClipboard key={ean} text={ean} />
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
          {target === "a" &&
            params.row["asin"] &&
            params.row["asin"] !== "" && (
              <div>
                <span className="font-semibold">ASIN: </span>
                <CopyToClipboard text={params.row["asin"]} />
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
                        <span className="">
                          {" "}
                          {params.row["totalOfferCount"]}
                        </span>
                      ) : (
                        "0"
                      )}
                    </span>
                  </span>
                )}
              </div>
            )}
          {target === "e" &&
            params.row["esin"] &&
            params.row["esin"] !== "" && (
              <div>
                <span className="font-semibold">ESIN: </span>
                <CopyToClipboard text={params.row["esin"]} />
              </div>
            )}
          <></>
          <>
            {target === "e" &&
            params.row["ebyCategories"] &&
            params.row["ebyCategories"].length ? (
              <div>
                <span className="font-semibold">Kategorie:</span>
                <span>
                  {params.row["ebyCategories"].map((category: any) => {
                    return (
                      <span
                        className="mx-1"
                        key={category.id + category.category}
                      >
                        <Link
                          target="_blank"
                          href={
                            "https://www.ebay.de/b/" +
                            encodeURIComponent(category.category) +
                            "/" +
                            category.id
                          }
                        >
                          {category.category}
                        </Link>
                        <span className="font-semibold"> ID: </span>
                        <CopyToClipboard text={category.id} />
                      </span>
                    );
                  })}
                </span>
              </div>
            ) : (
              <></>
            )}
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
            {target === "a" && params.row["monthlySold"] && (
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
      ImageRenderer(
        prefixLink(
          params.row[`${target}_img` as keyof ModifiedProduct],
          params.row.s
        )
      ),
  },
  {
    field: "prc",
    headerName: `Preis`,
    headerAlign: "left",
    align: "left",
    renderHeader: (params) => (
      <div className="relative w-16 flex">
        <Tooltip title="Einkaufspreis" placement="topLeft">
          <div>EK</div>
        </Tooltip>
        <div className="absolute bottom-1 text-xs text-gray-500">
          <span className="text-green-600">
            {settings?.netto ? "Netto" : "Brutto"}
          </span>
        </div>
      </div>
    ),
    renderCell: (params) => (
      <div className="flex flex-col">
        <div
          className={`${settings.netto ? "" : "font-semibold text-green-600"}`}
        >
          {formatCurrency(parseFloat(params.value))}
        </div>
        {params.row.qty > 1 && (
          <span className="text-xs">({params.row.uprc} € / Stück)</span>
        )}
        <div
          className={`${settings.netto ? "font-semibold text-green-600" : ""}`}
        >
          {formatCurrency(calculationDeduction(parseFloat(params.value), true))}
        </div>
      </div>
    ),
    width: 120,
  },
  {
    field: `${target}_prc`,
    width: 170,
    align: "left",
    headerAlign: "left",
    headerName: "Zielshoppreis",
    renderHeader: (params) => (
      <div className="relative w-24 flex">
        <Tooltip title="Verkaufspreis" placement="topLeft">
          <div>VK {target === "a" ? "(∅ 90 Tage)" : ""}</div>
        </Tooltip>

        <div className="absolute bottom-1 text-xs">
          <span className="text-green-600">
            {settings?.netto ? "Netto" : "Brutto"}
          </span>
        </div>
      </div>
    ),
    renderCell: (params) => (
      <div className="flex flex-col">
        <div
          className={`${settings.netto ? "" : "font-semibold text-green-600"}`}
        >
          <span>{formatCurrency(parseFloat(params.value))} </span>
          <span className="">
            {target === "a"
              ? `(${formatter.format(params.row?.avg90_ahsprcs / 100)})`
              : ""}
          </span>
        </div>
        {params.row[`${target}_qty` as keyof ModifiedProduct] > 1 && (
          <span className="text-xs">
            ({params.row[`${target}_uprc` as keyof ModifiedProduct]} € / Stück)
          </span>
        )}
        <div
          className={`${settings.netto ? "font-semibold text-green-600" : ""}`}
        >
          {formatCurrency(calculationDeduction(parseFloat(params.value), true))}
        </div>
      </div>
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
    renderHeader: (params) => (
      <div className="relative">
        <div>Marge</div>
      </div>
    ),
    renderCell: (params) => (
      <Popover
        placement="topLeft"
        arrow={false}
        content={
          params.row["costs"] && target === "a" ? (
            <ContentMarge product={params.row} />
          ) : (
            <ContentEbyMarge product={params.row} settings={settings} />
          )
        }
        title="Margenberechnung"
      >
        <div className="flex flex-col">
          <div
            className={`${
              settings.netto ? "" : "font-semibold text-green-600"
            }`}
          >
            {formatCurrency(parseFloat(params.value))}
          </div>
        </div>
      </Popover>
    ),
  },
  {
    field: "isBookmarked",
    headerName: "Gemerkt",
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Checkbox
        checked={params.row.isBookmarked}
        onChange={(e) => {
          if (e.target.checked) {
            addBookmark({
              body: { target: target, shop: domain, productId: params.row._id },
              page: pagination.page,
              pageSize: pagination.pageSize,
            });
          } else {
            removeBookmark({
              body: { target: target, shop: domain, productId: params.row._id },
              page: pagination.page,
              pageSize: pagination.pageSize,
            });
          }
        }}
      />
    ),
  },
];
