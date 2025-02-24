"use client";

import Disclaimer from "@/components/Disclaimer";
import ProductsTableTabs from "@/components/ProductsTableTabs";
import Title from "antd/es/typography/Title";
import React from "react";

const kiBeta = [
  "rossmann.de",
  "dm.de",
  "mueller.de",
  "voelkner.de",
  "fressnapf.de",
  "quelle.de",
  'babymarkt.de',
  'galeria.de'
];

export default function Shop({ params }: { params: { domain: string } }) {
  return (
    <div className="h-full flex flex-col overflow-y-hidden relative">
      <Title className="relative">
        {params.domain.slice(0, 1).toUpperCase() + params.domain.slice(1)}
      {kiBeta.includes(params.domain) && (
        <div className="absolut !text-sm font-normal">
          Unsere KI-basierte Bündelerkennung befindet sich im Beta-Status.
          Deshalb kommt es zu Fehlern, die das Gewinnergebnis beeinflussen.
        </div>
      )}
      </Title>
      <Disclaimer />
      <ProductsTableTabs domain={params.domain} />
    </div>
  );
}
