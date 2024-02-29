"use client";

import { ProductTableRow } from "@/app/types/ProductTableRow";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import products from "../../../../../static/result.json";

import React, { useState } from "react";
import Link from "next/link";
import { formatter } from "@/app/util/formatter";
import Image from "next/image";
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
      return formatter.format(parseInt(price));
    } else {
      return "";
    }
  };

  const percentageFormatter = (margin_pct: string | undefined) => {
    if (margin_pct) {
      return margin_pct + " %";
    } else {
      return "";
    }
  };

  const columns: GridColDef<ProductTableRow>[] = [
    { field: "manufacturer", headerName: "Manufacturer", width: 120 },
    { field: "name", headerName: "Name", width: 250 },
    {
      field: "image",
      headerName: "Image",
      cellClassName: "hover:!overflow-visible",
      renderCell: (params) => ImagerRenderer(params.row.image),
    },
    {
      field: "price",
      headerName: `Price`,
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    {
      field: "link",
      headerName: `Link`,
      renderCell: (params) => renderLink(params.row.link),
    },
    {
      field: "amazon_link",
      headerName: "Link",
      renderCell: (params) => renderLink(params.row.amazon_link),
    },
    {
      field: "amazon_image",
      headerName: "Image",
      cellClassName: "hover:!overflow-visible",
      renderCell: (params) => ImagerRenderer(params.row.amazon_image),
    },
    { field: "amazon_name", headerName: "Name", width: 250 },
    {
      field: "amazon_price",
      headerName: "Price",
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    {
      field: "amazon_margin",
      headerName: "Margin",
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    { field: "amazon_profitable", headerName: "Profitable" },
    {
      field: "amazon_margin_pct",
      headerName: "Margin %",
      valueFormatter: (params) => percentageFormatter(params.value),
    },
    {
      field: "ebay_link",
      headerName: "Link",
      renderCell: (params) => renderLink(params.row.ebay_link),
    },
    {
      field: "ebay_image",
      headerName: "Image",
      cellClassName: "hover:!overflow-visible",
      renderCell: (params) => ImagerRenderer(params.row.amazon_image),
    },
    { field: "ebay_name", headerName: "Name", width: 250 },
    {
      field: "ebay_price",
      headerName: "Price",
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    {
      field: "ebay_margin",
      headerName: "Margin",
      valueFormatter: (params) => currencyFormatter(params.value),
    },
    { field: "ebay_profitable", headerName: "Profitable" },
    {
      field: "ebay_margin_pct",
      headerName: "Margin %",
      valueFormatter: (params) => percentageFormatter(params.value),
    },
  ];

  return (
    <div>
      <Title>{shop.title}</Title>
      <div className="h-[calc(100vh-100px)]">
        <DataGridPremium
          initialState={{
            pagination: { paginationModel: { pageSize: 30 } },
            pinnedColumns: { left: ["manufacturer", "name"] },
          }}
          rows={products as ProductTableRow[]}
          disableColumnMenu
          columnGroupingModel={[
            {
              groupId: `${shop.title}`,
              children: [{ field: "name" }, { field: "manufacturer" }],
            },
            {
              groupId: "Ebay",
              children: [
                {
                  field: "ebay_link",
                },
                { field: "ebay_image" },
                { field: "ebay_name" },
                {
                  field: "ebay_price",
                },
                {
                  field: "ebay_margin",
                },
                { field: "ebay_profitable" },
                {
                  field: "ebay_margin_pct",
                },
              ],
            },
            {
              groupId: "Amazon",
              children: [
                {
                  field: "amazon_link",
                },
                { field: "amazon_image" },
                { field: "amazon_name" },
                {
                  field: "amazon_price",
                },
                {
                  field: "amazon_margin",
                },
                { field: "amazon_profitable" },
                {
                  field: "amazon_margin_pct",
                },
              ],
            },
          ]}
          experimentalFeatures={{ columnGrouping: true }}
          columns={columns}
        />
      </div>
    </div>
  );
};

const ImagerRenderer = (imglink: string | undefined) => {
  const [src, setSrc] = useState(imglink);
  if (src) {
    return (
      <div id='image-container' className="relative h-16 w-16 hover:scale-[6] delay-500 cursor-pointer hover:overflow-visible hover:z-10 transition-all duration-500">
        <Image
          alt="product image"
          onError={() =>
            setSrc(
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABGCAYAAAAHFFAPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAERUlEQVR4nO2Z504rMRSEef83oBdFiCY6AdF7r4HQ51l8NSvOyvHdTUgAHTs5P0Yiawfs+c7YXtMHwJnQtR70aQ/ABANsRQBLsBUBbIlGD24JtgdDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhdAXg+/t7Nzk56SYmJtzV1VVhn9fXV7e+vp71GRgYcCMjI25pack9PT0V9q1Wq25sbMz19/e78fFxt7Gx4d7e3v50HjMzM9n4monjkP6fn59uf3/fVSqVbE7Dw8NuYWHB1Wq17gF8fn7uhoaGMhAUP4d9np+fc1ihCNqHTLg0TNppnPzMIvpLyBXv75aJhSf9V1ZWCsdJP+7u7tIHvLe31zCxMsBMKtuYAJn4zc1NXhg0Svqurq7m4G9vb7OUXF9fZ5/5nKvAX82nVqtlK1Cos7OzfKyXl5d5YcucDw8Ps3HW63U3NTWVPWOx8FmygDc3N/MJ0vQywJykmHNxcdHQJjBpBj8zndJ3Z2enoe/W1laejvf399JxnZ6eZoYXbSP8HZ3MVeZHePJsdnY2ezY9Pd3QlwUsXkgxJAmY6eKye3x8nBneLMFcdov2WgEsxrEA5PeE/ZkuaWOiUTAmjoNj4qriQyZcrgB8znG3M09uL1J0MjcW7eDgYPaMe3D4Ha5UbPP36+QAh8Y2A1wkmsTDk2/E7u5uvp+Fy9vHx0f+N4pMxZceHh5ymITswz06Omp7btxzZf8vKrZwVfLTPTc317uAt7e3s/48eTIl/rJPIEXfYV+287to8rt9yPxOp3A5Lkkql355zlVA5lt0mJIzh7+k9xRgmkXTKb//bwEG4E5OTvIxLS8vdzSvtbW1wgOTAW5iGoHKyfvg4KCh7TeWaAR7bqcJ5olYxsli8dtsif4GXL5ihe0/PWQhgEuoXK5HR0fbhiwHQB6YwmKzQ1YLuExqUZ+fvibV6/UcLk/38tyH/J0thMUlYy0riq5/TWpnD/bhcj9kUrkPi/xXl7KLDtl/W110VKvVBrg+5Pn5+W/dhMkNFU/5ZZcV/kUHt5quu+ig+Bogd7QyWb6H8vPi4mLW5/Hx8b/brlBs57uy9lUlgvSGZ4SyQujaq0ofcCgBzGWq1QU+9fLyov7PBnyd5Dkevuq0SmBP/LPBBDUPDDC6uwANMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKi+gdczqPQcNTxwAAAAABJRU5ErkJggg=="
            )
          }
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABGCAYAAAAHFFAPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAERUlEQVR4nO2Z504rMRSEef83oBdFiCY6AdF7r4HQ51l8NSvOyvHdTUgAHTs5P0Yiawfs+c7YXtMHwJnQtR70aQ/ABANsRQBLsBUBbIlGD24JtgdDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhdAXg+/t7Nzk56SYmJtzV1VVhn9fXV7e+vp71GRgYcCMjI25pack9PT0V9q1Wq25sbMz19/e78fFxt7Gx4d7e3v50HjMzM9n4monjkP6fn59uf3/fVSqVbE7Dw8NuYWHB1Wq17gF8fn7uhoaGMhAUP4d9np+fc1ihCNqHTLg0TNppnPzMIvpLyBXv75aJhSf9V1ZWCsdJP+7u7tIHvLe31zCxMsBMKtuYAJn4zc1NXhg0Svqurq7m4G9vb7OUXF9fZ5/5nKvAX82nVqtlK1Cos7OzfKyXl5d5YcucDw8Ps3HW63U3NTWVPWOx8FmygDc3N/MJ0vQywJykmHNxcdHQJjBpBj8zndJ3Z2enoe/W1laejvf399JxnZ6eZoYXbSP8HZ3MVeZHePJsdnY2ezY9Pd3QlwUsXkgxJAmY6eKye3x8nBneLMFcdov2WgEsxrEA5PeE/ZkuaWOiUTAmjoNj4qriQyZcrgB8znG3M09uL1J0MjcW7eDgYPaMe3D4Ha5UbPP36+QAh8Y2A1wkmsTDk2/E7u5uvp+Fy9vHx0f+N4pMxZceHh5ymITswz06Omp7btxzZf8vKrZwVfLTPTc317uAt7e3s/48eTIl/rJPIEXfYV+287to8rt9yPxOp3A5Lkkql355zlVA5lt0mJIzh7+k9xRgmkXTKb//bwEG4E5OTvIxLS8vdzSvtbW1wgOTAW5iGoHKyfvg4KCh7TeWaAR7bqcJ5olYxsli8dtsif4GXL5ihe0/PWQhgEuoXK5HR0fbhiwHQB6YwmKzQ1YLuExqUZ+fvibV6/UcLk/38tyH/J0thMUlYy0riq5/TWpnD/bhcj9kUrkPi/xXl7KLDtl/W110VKvVBrg+5Pn5+W/dhMkNFU/5ZZcV/kUHt5quu+ig+Bogd7QyWb6H8vPi4mLW5/Hx8b/brlBs57uy9lUlgvSGZ4SyQujaq0ofcCgBzGWq1QU+9fLyov7PBnyd5Dkevuq0SmBP/LPBBDUPDDC6uwANMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKi+gdczqPQcNTxwAAAAABJRU5ErkJggg=="
          objectFit="contain"
          fill={true}
          src={src}
        />
      </div>
    );
  } else {
    return (
      <div className="relative h-16 h-16">
        <Image alt="product image" src={"https://placehold.co/120x70/png"} />
      </div>
    );
  }
};

export default Shop;
