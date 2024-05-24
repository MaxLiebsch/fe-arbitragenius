import { ModifiedProduct, Product } from "@/types/Product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export type ProductPagination = {
  page: number;
  pageSize: number;
};

export type ProductSort =
  | undefined
  | {
      field: string;
      direction: "asc" | "desc";
    };

type ProductBsr = {
  number: number;
  category: string;
};

export default function useTaskProducts(
  taskId: string,
  pagination: ProductPagination,
  sort: ProductSort,
  refetchOnWindowFocus: boolean = true
) {
  const queryClient = useQueryClient();

  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey: [
      "tasks",
      taskId,
      "product",
      pagination.page,
      pagination.pageSize,
      sort?.field,
      sort?.direction,
    ],
    refetchOnWindowFocus,
    queryFn: async () => {
      let sortQuery = "";
      let settingsQuery = "";
      if (sort) sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
      return fetch(
        `/app/api/tasks/${taskId}/product?page=${pagination.page}&size=${pagination.pageSize}${sortQuery}${settingsQuery}`
      ).then((resp) => resp.json());
    },
    select: (data): ModifiedProduct[] => {
      return data.map((product) => {
        const bsrLength = product.bsr?.length;
        const bsr: { [key: string]: number | string } = {};
        if (product.bsr && product.bsr.length > 0) {
          const bsrArr = [...product.bsr] as ProductBsr[];
          if (bsrLength > 0) {
            bsr["bsr_1"] = bsrArr[0].number;
            bsr["bsr_cat_1"] = bsrArr[0].category;
          }
          if (bsrLength > 1) {
            bsr["bsr_2"] = bsrArr[1].number;
            bsr["bsr_cat_2"] = bsrArr[1].category;
          }
          if (bsrLength > 2) {
            bsr["bsr_3"] = bsrArr[2].number;
            bsr["bsr_cat_3"] = bsrArr[2].category;
          }
        }
        return { ...product, ...bsr };
      });
    },
  });

  useEffect(() => {
    if (pagination.page < 10) {
      queryClient.prefetchQuery({
        queryKey: [
          "tasks",
          taskId,
          "product",
          pagination.page + 1,
          pagination.pageSize,
          sort?.field,
          sort?.direction,
        ],
        queryFn: async () => {
          let sortQuery = "";
          if (sort)
            sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
          return fetch(
            `/app/api/tasks/${taskId}/product?page=${
              pagination.page + 1
            }&size=${pagination.pageSize}${sortQuery}`
          ).then((resp) => resp.json());
        },
      });
    }
  }, [
    productQuery.data,
    pagination.page,
    pagination.pageSize,
    sort,
    taskId,
    sort?.field,
    sort?.direction,
    queryClient,
  ]);

  return productQuery;
}
