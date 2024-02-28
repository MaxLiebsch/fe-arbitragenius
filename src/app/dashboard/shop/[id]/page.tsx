"use client";

import { ProductTableRow } from "@/app/types/ProductTableRow";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import products from "../../../../../static/result.json";

import React from "react";
import Link from "next/link";
import { formatter } from "@/app/util/formatter";
const shops = [
  {
    _id: "1",
    title: "shopa.de",
    availableProducts: "2427",
    profitableProducts: {
      ebay: "8",
      amazon: "8",
    },
  },
  {
    _id: "2",
    title: "shopb.de",
    availableProducts: "2427",
    profitableProducts: {
      ebay: "8",
      amazon: "8",
    },
  },
  {
    _id: "4",
    title: "shopd.de",
    availableProducts: "2427",
    profitableProducts: {
      ebay: "8",
      amazon: "8",
    },
  },
  {
    _id: "3",
    title: "shopc.de",
    availableProducts: "2427",
    profitableProducts: {
      ebay: "8",
      amazon: "8",
    },
  },
];

function fetchShop(id: string) {
  const res = shops.find((shop) => shop._id === id);
  return res;
}

const Shop = ({ params }: { params: { id: string } }) => {
  const shop = fetchShop(params.id);
  if (!shop) {
    redirect("/dashboard");
  }

  const renderLink = (link: string | undefined) => {
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
  const currencyFormatter = (price: string | undefined) => {
    if (price) {
      return formatter.format(parseInt(price))
    } else {
      return '';
    }
  };

  const columns: GridColDef<ProductTableRow>[] = [
    { field: "manufacturer", headerName: "Manufacturer", width: 120 },
    { field: "name", headerName: "Name", width: 250 },
    // { field: "image", headerName: "Image" },
    {
      field: "link",
      headerName: "Product Link",
      renderCell: (params) => renderLink(params.row.link),
    },
    {
      field: "amazon_link",
      headerName: "Amazon link",
      renderCell: (params) => renderLink(params.row.amazon_link),
    },
    // { field: "amazon_image", headerName: "Amazon image" },
    { field: "amazon_name", headerName: "Amazon name" },
    { field: "amazon_price", headerName: "Amazon price" },
    {
      field: "amazon_bestMatchPrice",
      headerName: "Amazon Best match price",
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    {
      field: "amazon_productPrice",
      headerName: "Amazon Product price",
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    {
      field: "amazon_bruttomargin",
      headerName: "Amazon Brutto margin",
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    { field: "amazon_profitable:", headerName: "Amazon Profitable" },
    {
      field: "amazon_marginInPercentage",
      headerName: "Amazon Margin %",
    },
    {
      field: "ebay_link",
      headerName: "Ebay Link",
      renderCell: (params) => renderLink(params.row.ebay_link),
    },
    // { field: "ebay_image", headerName: "Ebay Image" },
    { field: "ebay_name", headerName: "Ebay Name" },
    { field: "ebay_price", headerName: "Ebay Price" },
    { field: "ebay_bestMatchPrice", headerName: "Ebay Bestmatch price" },
    { field: "ebay_productPrice", headerName: "Ebay Product price" },
    { field: "ebay_bruttomargin", headerName: "Ebay Brutto margin" },
    { field: "ebay_profitable:", headerName: "Ebay Profitable" },
    { field: "ebay_marginInPercentage", headerName: "Ebay Margin %" },
  ];

  return (
    <div>
      <Title>{shop.title}</Title>
      <div className="h-[calc(100vh-100px)]">
        <DataGridPremium
          initialState={{ pagination: { paginationModel: { pageSize: 30 } } }}
          rows={products}
          disableColumnMenu
          columns={columns}
        />
      </div>
    </div>
  );
};

export default Shop;
