"use client";
import useShopCount from "@/hooks/use-shop-count";
import useShops, { ShopPagination } from "@/hooks/use-shops";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./Spinner";

const columns: GridColDef[] = [
  { field: "ne", headerName: "ShopName", flex: 0.5 },
  { field: "d", headerName: "Domain", flex: 0.5 },
];

export default function ShopsTable(props: { className?: string }) {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState<ShopPagination>({
    page: 0,
    pageSize: 20,
  });

  const shopCountQuery = useShopCount();
  const shopQuery = useShops(paginationModel);

  return (
    <DataGridPremium
      className={props.className}
      onRowClick={(row) => router.push(`/dashboard/shop/${row.row.d}`)}
      getRowId={(row) => row._id}
      disableColumnMenu
      columns={columns}
      rows={shopQuery.data ?? []}
      rowCount={shopCountQuery.data}
      loading={shopQuery.isFetching}
      pageSizeOptions={[5, 10, 20]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMode="server"
      pagination={true}
      autoHeight
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
