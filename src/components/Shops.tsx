"use client";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const columns: GridColDef[] = [
  { field: "ne", headerName: "ShopName", flex: 0.5 },
  { field: "d", headerName: "Domain", flex: 0.5 },
];

export default function Shops() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const shopCountQuery = useQuery({
    queryKey: ["shop", "count"],
    queryFn: () => fetch("/api/shop/count").then((resp) => resp.json()),
  });

  const shopQuery = useQuery({
    queryKey: ["shop", paginationModel.page, paginationModel.pageSize],
    queryFn: () =>
      fetch(
        `/api/shop?page=${paginationModel.page}&size=${paginationModel.pageSize}`
      ).then((resp) => resp.json()),
  });

  useEffect(() => {
    if (paginationModel.page < 11) {
      queryClient.prefetchQuery({
        queryKey: ["shop", paginationModel.page + 1, paginationModel.pageSize],
        queryFn: () =>
          fetch(
            `/api/shop?page=${paginationModel.page + 1}&size=${
              paginationModel.pageSize
            }`
          ).then((resp) => resp.json()),
      });
    }
  }, [
    shopQuery.data,
    paginationModel.page,
    paginationModel.pageSize,
    queryClient,
  ]);

  return (
    <DataGridPremium
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
    />
  );
}
