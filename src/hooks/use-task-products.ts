import { ModifiedProduct } from "@/types/Product";
import { WholeSaleTarget } from "@/types/tasks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserSettings } from "./use-settings";
import { Settings } from "@/types/Settings";
import { GridSortItem } from "@mui/x-data-grid-premium";

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
  sort: GridSortItem,
  target: WholeSaleTarget,
  refetchOnWindowFocus: boolean = true
) {
  const queryClient = useQueryClient();
  let settingsQuery = "";
  const [settings, setUserSettings] = useUserSettings();
  if (settings) {
    settingsQuery = Object.keys(settings)
      .map((key) => `&${key}=${settings[key as keyof Settings]}`)
      .join("");
  }
  const productQuery = useQuery<ModifiedProduct[]>({
    queryKey: [
      target,
      "tasks",
      taskId,
      "product",
      pagination.page,
      pagination.pageSize,
      sort?.field,
      sort?.sort,
      ...(settings ? Object.values(settings) : [])
    ],
    refetchOnWindowFocus: true,
    queryFn: async () => {
      let sortQuery = "";

      if (sort) sortQuery = `&sortby=${sort.field}&sortorder=${sort.sort}`;
      return fetch(
        `/app/api/tasks/${taskId}/product?page=${pagination.page}&size=${pagination.pageSize}${sortQuery}&target=${target}&${settingsQuery}`
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
          sort?.sort,
        ],
        queryFn: async () => {
          let sortQuery = "";
          if (sort)
            sortQuery = `&sortby=${sort.field}&sortorder=${sort.sort}`;
          return fetch(
            `/app/api/tasks/${taskId}/product?page=${pagination.page}&size=${pagination.pageSize}${sortQuery}&target=${target}&${settingsQuery}`
          ).then((resp) => resp.json());
        },
      });
    }
  }, [
    productQuery.data,
    target,
    pagination.page,
    settingsQuery,
    pagination.pageSize,
    sort,
    taskId,
    sort?.field,
    sort?.sort,
    queryClient,
  ]);

  return productQuery;
}
