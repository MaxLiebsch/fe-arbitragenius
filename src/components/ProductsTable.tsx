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
import { Spin } from "antd";
import useShop from "@/hooks/use-shop";
import useProductCount from "@/hooks/use-product-count";
import useProducts, {
  ProductPagination,
  ProductSort,
} from "@/hooks/use-products";

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
  { field: "mnfctr", headerName: "Manufacturer", width: 120 },
  { field: "nm", headerName: "Name", width: 250 },
  {
    field: "img",
    headerName: "Image",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.img),
  },
  {
    field: "prc",
    headerName: `Price`,
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "lnk",
    headerName: `Link`,
    renderCell: (params) => LinkWrapper(params.row.lnk),
  },
  {
    field: "a_lnk",
    headerName: "Link",
    renderCell: (params) => LinkWrapper(params.row.a_lnk),
  },
  {
    field: "a_img",
    headerName: "Image",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.amazon_image),
  },
  { field: "a_nm", headerName: "Name", width: 250 },
  {
    field: "a_prc",
    headerName: "Price",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "a_mrgn",
    headerName: "Margin",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  { field: "a_fat", headerName: "Profitable" },
  {
    field: "a_mrgn_pct",
    headerName: "Margin %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: "e_lnk",
    headerName: "Link",
    renderCell: (params) => LinkWrapper(params.row.e_lnk),
  },
  {
    field: "e_img",
    headerName: "Image",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(params.row.amazon_image),
  },
  { field: "e_nm", headerName: "Name", width: 250 },
  {
    field: "e_prc",
    headerName: "Price",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  {
    field: "e_mrgn",
    headerName: "Margin",
    valueFormatter: (params) => formatCurrency(params.value),
  },
  { field: "e_fat", headerName: "Profitable" },
  {
    field: "e_mrgn_pct",
    headerName: "Margin %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
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
          children: [{ field: "nm" }, { field: "mnfctr" }],
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
            <Spin />
          </div>
        ),
      }}
    />
  );
}
