"use client";
import React from "react";
import useProductCount from "@/hooks/use-product-count";
import useProducts from "@/hooks/use-products";
import { usePaginationAndSort } from "@/hooks/use-pagination-sort";
import ProductsTable from "./ProductsTable";

export type ProductTableProps = {
  domain: string;
  target: string;
  className?: string;
};

export default function ProductsTablePanel(props: ProductTableProps) {
  const { className, domain, target } = props;
  const [paginationModel, setPaginationModel, sortModel, setSortModel] =
  usePaginationAndSort();

  const productCountQuery = useProductCount(domain, target);
  const productQuery = useProducts(domain, paginationModel, sortModel, target);

  return (
    <ProductsTable
      domain={domain}
      target={target}
      className={className}
      productCountQuery={productCountQuery}
      productQuery={productQuery}
    />
  );
}
