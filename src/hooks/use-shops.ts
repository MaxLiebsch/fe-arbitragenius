import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Shop } from "./use-shop";

export type ShopPagination = {
  page: number;
  pageSize: number;
};

export default function useShops(pagination: ShopPagination) {
  const queryClient = useQueryClient();

  const shopQuery = useQuery<Shop[]>({
    queryKey: ["shop", pagination.page, pagination.pageSize],
    queryFn: () =>
      fetch(
        `/app/api/shop?page=${pagination.page}&size=${pagination.pageSize}`
      ).then((resp) => resp.json()),
  });

  useEffect(() => {
    if (pagination.page < 11) {
      queryClient.prefetchQuery({
        queryKey: ["shop", pagination.page + 1, pagination.pageSize],
        queryFn: () =>
          fetch(
            `/app/api/shop?page=${pagination.page + 1}&size=${pagination.pageSize}`
          ).then((resp) => resp.json()),
      });
    }
  }, [shopQuery.data, pagination.page, pagination.pageSize, queryClient]);

  return shopQuery;
}
