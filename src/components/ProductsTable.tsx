"use client";
import {
  DataGridPremium,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid-premium";
import { useState } from "react";
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

const LinkWrapper = (link: string | undefined) => {
  if (link) {
    return (
      <Link href={link} target="_blank">
        Visit
      </Link>
    );
  } else {
    return <></>;
  }
};

const columns: GridColDef[] = [
  { field: "mnfctr", headerName: "Hersteller", width: 120 },
  { field: "nm", headerName: "Name", width: 250 },
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
    field: "lnk",
    headerName: `Link`,
    renderCell: (params) => LinkWrapper(params.row.lnk),
  },
  { field: "a_nm", headerName: "Name", width: 250 },
  {
    field: "a_img",
    headerName: "Produktbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.a_img),
  },
  {
    field: "a_mrgn_pct",
    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: "a_mrgn",
    headerName: "Marge",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "a_lnk",
    headerName: "Link",
    renderCell: (params) => LinkWrapper(params.row.a_lnk),
  },
  {
    field: "a_bsr",
    headerName: "BSR",
    renderCell: (params) => (
      <Image src={ComingSoon} alt="coming-soon" width={120} height={70} />
    ),
  },
  {
    field: "a_prc",
    headerName: "Preis",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  { field: "a_fat", headerName: "Profitable" },
  { field: "e_nm", headerName: "Name", width: 250 },
  {
    field: "e_img",
    headerName: "Produktbild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.e_img),
  },
  {
    field: "e_mrgn",
    headerName: "Marge",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "e_mrgn_pct",
    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: "e_lnk",
    headerName: "Link",
    renderCell: (params) => LinkWrapper(params.row.e_lnk),
  },
  {
    field: "e_prc",
    headerName: "Preis",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  { field: "e_fat", headerName: "Profitable" },
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
  const [sortModel, setSortModel] = useState<ProductSort>();

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
      className={className}
      initialState={{ pinnedColumns: { left: ["mnfctr", "nm"] } }}
      getRowId={(row) => row._id}
      disableColumnMenu
      columns={columns}
      rows={productQuery.data ?? []}
      rowCount={productCountQuery.data}
      loading={productQuery.isFetching}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      pagination={true}
      sortingMode="server"
      onSortModelChange={handleSortModelChange}
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={[
        {
          groupId: shopQuery.data?.ne ?? "Loading ...",
          children: [{ field: "nm" }, { field: "mnfctr" }, { field: "ctrgy" }],
        },
        {
          groupId: "Ebay",
          children: [
            { field: "e_lnk" },
            { field: "e_img" },
            { field: "e_nm" },
            { field: "e_prc" },
            { field: "e_mrgn" },
            { field: "e_fat" },
            { field: "e_mrgn_pct" },
          ],
        },
        {
          groupId: "Amazon",
          children: [
            { field: "a_lnk" },
            { field: "a_bsr" },
            { field: "a_img" },
            { field: "a_nm" },
            { field: "a_prc" },
            { field: "a_mrgn" },
            { field: "a_fat" },
            { field: "a_mrgn_pct" },
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
