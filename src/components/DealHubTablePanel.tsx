"use client";
import React from "react";
import { usePaginationAndSort } from "@/hooks/use-pagination-sort";
import ProductsTable from "./ProductsTable";
import { Week } from "@/types/Week";
import useDealhubProductCount from "@/hooks/use-dealhub-count";
import useDealhubProducts from "@/hooks/use-dealhub-products";

export type ProductTableProps = {
  target: string;
  className?: string;
  week: Week;
};

export default function DealHubTablePanel(props: ProductTableProps) {
  const { className, target, week } = props;
  const { paginationModel, sortModel } = usePaginationAndSort();

  const productCountQuery = useDealhubProductCount(target, week);
  const productQuery = useDealhubProducts(
    paginationModel,
    sortModel,
    target,
    week
  );

  return (
    <ProductsTable
      domain={"dealhub"}
      target={target}
      className={className}
      productCountQuery={productCountQuery}
      productQuery={productQuery}
    />
  );
}
