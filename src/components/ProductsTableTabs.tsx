"use client";

import { Tab } from "@headlessui/react";
import React from "react";
import ProductsTable from "./ProductsTable";
import { useTargetShop } from "@/hooks/use-targetShop";
import { useUserSettings } from "@/hooks/use-settings";

const ProductTableTabs = ({ domain }: { domain: string }) => {
  const [selectedIndex, setSelectedIndex] = useTargetShop();
  const [userSettings] = useUserSettings();

  return (
    <div className="relative">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex min-w-full flex-none gap-x-6 text-lg font-semibold leading-2 text-gray-400 pb-2">
          {[
            { name: "Amazon", domain: "amazon.de", target: 'a' },
            { name: "Ebay", domain: "ebay.de", target: 'e' },
            { name: "Kaufland (Coming soon)", domain: "kaufland.de" , target: 'k' },
          ].map((item) => {
            const targetDisabled =
              userSettings.loaded &&
              !userSettings.targetPlatforms.includes(item.target);
            return (
              <Tab key={item.name} disabled={targetDisabled}>
                {({ selected }) => (
                  <div
                    key={item.name}
                    className={selected ? "text-primary-950" : ""}
                  >
                    {item.name}
                  </div>
                )}
              </Tab>
            );
          })}
        </Tab.List>
        <div className="absolute text-primary-950 text-xs right-0 top-[1.25rem]">
          DipMax Export GmbH übernimmt für die dargestellten Informationen und
          deren Genauigkeit und Vollständigkeit keine Gewährleistung.
        </div>
        <Tab.Panels className="flex h-[calc(100vh-198px)]">
          <Tab.Panel className="w-full  h-full">
            <ProductsTable domain={domain} target="a" />
          </Tab.Panel>
          <Tab.Panel className="w-full h-full">
            <ProductsTable domain={domain} target="e" />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProductTableTabs;
