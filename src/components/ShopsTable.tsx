"use client";
import useShopCount from "@/hooks/use-shop-count";
import useShops, { ShopPagination } from "@/hooks/use-shops";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./Spinner";

const columns: GridColDef[] = [
  { field: "ne", headerName: "ShopName", flex: 0.2 },
  { field: "d", headerName: "Domain", flex: 0.2 },
  { field: "total", headerName: "Gesamt", flex: 0.2 },
  { field: "a_fat_total", headerName: "Amazon", flex: 0.2 },
  { field: "e_fat_total", headerName: "Ebay", flex: 0.2 },
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
      className={props.className}
      onRowClick={(row) => router.push(`/dashboard/shop/${row.row.d}`)}
      getRowId={(row) => row._id}
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={[
        {
          groupId: "Profitabel",
          children: [{ field: "a_fat_total" }, { field: "e_fat_total" }],
        },
      ]}
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
