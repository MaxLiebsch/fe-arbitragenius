import { appendPercentage, formatCurrency, formatter } from "@/util/formatter";
import { GridColDef } from "@mui/x-data-grid-premium";
import { Settings } from "@/types/Settings";
import { calculationDeduction } from "@/util/calculateDeduction";
import { KeepaGraph } from "../components/KeepaGraph";
import { BookMarkProduct, ModifiedProduct } from "@/types/Product";
import { Checkbox, Popover, Tooltip } from "antd";
import ContentMarge from "../components/ContentMarge";
import ContentEbyMarge from "../components/ContentEbyMarge";
import { BookmarkDeleteSchema, BookmarkSchema } from "@/types/Bookmarks";
import { UseMutateFunction } from "@tanstack/react-query";
import { ProductPagination } from "@/hooks/use-products";
import InfoField from "@/components/columns/InfoField";

export const bookMarkColumns: (
  target: string,
  settings: Settings,
  pagination: ProductPagination,
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
  >,
  userRoles: string[]
) => GridColDef<BookMarkProduct>[] = (
  target,
  settings,
  pagination,
  addBookmark,
  removeBookmark,
  userRoles
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
    renderCell: (params) => (
      <InfoField
        product={params.row}
        target={target}
        pagination={pagination}
        userRoles={userRoles}
      />
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
            {target === "a" && params.row?.avg90_ahsprcs
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
              body: {
                target: target,
                shop: params.row.shop,
                productId: params.row._id,
              },
              page: pagination.page,
              pageSize: pagination.pageSize,
            });
          } else {
            removeBookmark({
              body: {
                target: target,
                shop: params.row.shop,
                productId: params.row._id,
              },
              page: pagination.page,
              pageSize: pagination.pageSize,
            });
          }
        }}
      />
    ),
  },
];
