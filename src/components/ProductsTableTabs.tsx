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
