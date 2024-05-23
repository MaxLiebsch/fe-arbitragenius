"use client";

import { Tab } from "@headlessui/react";
import React from "react";
import ProductsTable from "./ProductsTable";
import { Settings } from "@/types/Settings";

const ProductTableTabs = ({
  domain,
  settings,
}: {
  domain: string;
  settings: Settings;
}) => {
  return (
    <Tab.Group>
      <Tab.List className="flex min-w-full flex-none gap-x-6 text-lg font-semibold leading-2 text-gray-400 pb-2">
        {[
          { name: "Amazon", domain: "amazon.de" },
          { name: "Ebay", domain: "ebay.de" },
        ].map((item) => (
          <Tab key={item.name}>
            {({ selected }) => (
              <div
                key={item.name}
                className={selected ? "text-primary-950" : ""}
              >
                {item.name}
              </div>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="flex h-full">
        <Tab.Panel className="w-full max-h-[89%]">
          <ProductsTable domain={domain} target="a" settings={settings} />
        </Tab.Panel>
        <Tab.Panel className="w-full max-h-[89%]">
          <ProductsTable domain={domain} target="e" settings={settings} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default ProductTableTabs;
