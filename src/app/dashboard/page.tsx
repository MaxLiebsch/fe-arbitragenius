"use client";

import { Button, Card, Typography } from "antd";
import {
  StarIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/16/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { useRouter } from "next/navigation";

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

export default function Dashboard() {
  const [view, setView] = useState<"tile" | "list">("tile");
  const router = useRouter();

  const handleChangeView = (view: "tile" | "list") => setView(view);

  const columns: GridColDef[] = [
    { field: "title", headerName: "ShopName", flex: 0.2 },
    { field: "availableProducts", headerName: "Available Products", flex: 0.2 },
    {
      field: "profitableProducts",
      headerName: "Profitable Products Ebay",
      flex: 0.2,
      valueGetter: (params) => params.row?.profitableProducts.ebay,
    },
    {
      field: "profitableProducts",
      headerName: "Profitable Products Amazon",
      flex: 0.2,
      valueGetter: (params) => params.row?.profitableProducts.amazon,
    },
  ];

  return (
    <main>
      <div className="flex flex-row gap-2 mt-6 items-center">
        <Button type="text">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Retailer ({shops.length})
          </h3>
        </Button>
        <Button type="text">
          <h3 className="flex flex-row gap-1 items-center justify-items-center text-base font-semibold leading-6 text-gray-900">
            <StarIcon className="h-6 w-6" />
            <div>Favoriten</div>
          </h3>
        </Button>
        <Button
          className="ml-auto"
          icon={
            view === "list" ? (
              <ListBulletIcon className="h-6 w-6" />
            ) : (
              <Squares2X2Icon className="h-6 w-6" />
            )
          }
          onClick={() => handleChangeView(view === "tile" ? "list" : "tile")}
        />
      </div>
      <section className="mt-3">
        {view === "list" ? (
          <div className="grid grid-cols-3 gap-2 gap-y-3">
            {shops.map((shop) => (
              <Card key={shop.title} title={shop.title} bordered={false}>
                <div className="flex flex-row gap-2 items-center">
                  <Link href={`/dashboard/shop/${shop._id}`}>
                    <>
                      <p className="text-gray-500 font-bold">
                        Total products - {shop.availableProducts}
                      </p>
                      <p className="text-gray-500 font-bold">
                        Profitiable ebay - {shop.profitableProducts.ebay}
                      </p>
                      <p className="text-gray-500 font-bold">
                        Profitiable amazon - {shop.profitableProducts.amazon}
                      </p>
                    </>
                  </Link>
                  <Button
                    className="ml-auto"
                    icon={<StarIconOutline className="h-6 w-6" />}
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <DataGridPremium
              initialState={{
                sorting: {
                  sortModel: [{ field: "title", sort: "asc" }],
                },
              }}
              disableColumnMenu
              rows={shops}
              onRowClick={(row) => router.push(`/dashboard/shop/${row.id}`)}
              getRowId={(row) => row._id}
              columns={columns}
            />
          </div>
        )}
      </section>
    </main>
  );
}
