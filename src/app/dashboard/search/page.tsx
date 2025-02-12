"use client";
import Title from "antd/es/typography/Title";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ProductsTable from "@/components/ProductsTable";
import useSearch from "@/hooks/use-search";
import useSearchCount from "@/hooks/use-search-count";

const Page = () => {
  const queryClient = useQueryClient();
  const search = useSearchParams().get("q");
  const target = useSearchParams().get("target")?.slice(0, 1);
  const router = useRouter();
  const pathname = usePathname();

  //TODO: useSearchCount
  const searchQuery = useSearch({ query: search || "", target: target });
  const searchQueryCount = useSearchCount({
    query: search || "",
    target: target,
  });

  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Title>Suche</Title>
      </div>
      {/* Content */}

      <div className="relative">
        <div className="absolute text-gray-dark text-xs right-0 -top-[0.85rem]">
          DipMax Export GmbH übernimmt für die dargestellten Informationen und
          deren Genauigkeit und Vollständigkeit keine Gewährleistung.
        </div>
        <div className="flex h-[calc(100vh-220px)]">
          <ProductsTable
            domain="search"
            target={target?.slice(0, 1) || "a"}
            productCountQuery={searchQueryCount}
            productQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
