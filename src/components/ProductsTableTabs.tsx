"use client";

import { Tab } from "@headlessui/react";
import React from "react";
import ProductsTablePanel from "./ProductsTablePanel";
import SourceshopTabGroup from "./SourceshopTabGroup";

const ProductTableTabs = ({ domain }: { domain: string }) => {
  return (
    <div className="relative">
      <SourceshopTabGroup>
        <>
          <div className="absolute text-gray-dark text-xs right-0 top-[1.25rem]">
            DipMax Export GmbH übernimmt für die dargestellten Informationen und
            deren Genauigkeit und Vollständigkeit keine Gewährleistung.
          </div>
          <Tab.Panels className="flex h-[calc(100vh-220px)]">
            <Tab.Panel className="w-full  h-full">
              <ProductsTablePanel domain={domain} target="a" />
            </Tab.Panel>
            <Tab.Panel className="w-full h-full">
              <ProductsTablePanel domain={domain} target="e" />
            </Tab.Panel>
          </Tab.Panels>
        </>
      </SourceshopTabGroup>
    </div>
  );
};

export default ProductTableTabs;
