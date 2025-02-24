"use client";
import Title from "antd/es/typography/Title";
import React from "react";
import { useSearchParams } from "next/navigation";
import ProductsTable from "@/components/ProductsTable";
import useSearch from "@/hooks/use-search";
import useSearchCount from "@/hooks/use-search-count";
import Disclaimer from "@/components/Disclaimer";

const Page = () => {
  const search = useSearchParams().get("q");
  const target = useSearchParams().get("target")?.slice(0, 1);

  const searchQuery = useSearch({ query: search || "", target: target });
  const searchQueryCount = useSearchCount({
    query: search || "",
    target: target,
  });

  return (
    <div className="h-full flex flex-col overflow-y-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Title>Suche</Title>
      </div>
      <Disclaimer />
      {/* Content */}

      <div>
        <div className="flex h-[calc(100vh-170px)]">
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
