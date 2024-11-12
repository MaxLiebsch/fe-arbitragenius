"use client";

import ProductsTableTabs from "@/components/ProductsTableTabs";
import Title from "antd/es/typography/Title";
import React from "react";

export default function Shop({ params }: { params: { domain: string } }) {
  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      <Title>
        {params.domain.slice(0, 1).toUpperCase() + params.domain.slice(1)}
      </Title>
      <ProductsTableTabs domain={params.domain} />
    </div>
  );
}
