import { Settings } from "@/types/Settings";
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

export type Product = {
  ean: string;
  _id: string;
  pblsh: boolean;
  vrfd: boolean;
  ctgry: string;
  mnfctr: string;
  nm: string;
  e_prc: number;
  a_prc: number;
  img: string;
  lnk: string;
  prc: number;
  createdAt: string;
  updatedAt: string;
  e_lnk: string;
  e_img: string;
  e_nm: string;
  e_mrgn: number;
  e_fat: boolean;
  e_mrgn_pct: number;
  a_lnk: string;
  a_img: string;
  a_nm: string;
  a_mrgn: number;
  a_fat: boolean;
  a_mrgn_pct: number;
};

export default function useProducts(
  domain: string,
  pagination: ProductPagination,
  sort: ProductSort,
  target: string,
  settings: Settings
) {
  const queryClient = useQueryClient();

  const productQuery = useQuery<Product[]>({
    queryKey: [
      "shop",
      domain,
      "product",
      pagination.page,
      pagination.pageSize,
      sort?.field,
      sort?.direction,
    ],
    queryFn: async () => {
      let sortQuery = "";
      if (sort) sortQuery = `&sortby=${sort.field}&sortorder=${sort.direction}`;
      return fetch(
        `/app/api/shop/${domain}/${target}/product?minMargin=${settings.minMargin}&minPercentageMargin=${settings.minPercentageMargin}&page=${pagination.page}&size=${pagination.pageSize}${sortQuery}`
      ).then((resp) => resp.json());
    },
  });

  useEffect(() => {
    if (pagination.page < 10) {
      queryClient.prefetchQuery({
        queryKey: [
          "shop",
          domain,
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
            `/app/api/shop/${domain}/${target}/product?page=${
              pagination.page + 1
            }&size=${pagination.pageSize}${sortQuery}`
          ).then((resp) => resp.json());
        },
      });
    }
  }, [
    productQuery.data,
    domain,
    target,
    pagination.page,
    pagination.pageSize,
    sort,
    sort?.field,
    sort?.direction,
    queryClient,
  ]);

  return productQuery;
}
