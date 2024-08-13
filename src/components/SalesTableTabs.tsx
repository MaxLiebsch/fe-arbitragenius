"use client";

import { Tab } from "@headlessui/react";
import React from "react";
import { Settings } from "@/types/Settings";
import SalesTable from "./SalesTable";
import { useTargetShop } from "@/hooks/use-targetShop";

const SalesTableTabs = ({
  settings,
}: {
  settings: Settings;
}) => {
  const [selectedIndex, setSelectedIndex]= useTargetShop()

  return (
    <div className="relative">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List  className="flex min-w-full flex-none gap-x-6 text-lg font-semibold leading-2 text-gray-400 pb-2">
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
        <div className="absolute text-primary-950 text-xs right-0 top-[1.25rem]">
          DipMax Export GmbH übernimmt für die dargestellten Informationen und
          deren Genauigkeit und Vollständigkeit keine Gewährleistung.
        </div>
        <Tab.Panels className="flex h-[calc(100vh-198px)]">
          <Tab.Panel className="w-full  h-full">
            <SalesTable target="a" settings={settings} />
          </Tab.Panel>
          <Tab.Panel className="w-full h-full">
            <SalesTable target="e" settings={settings} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SalesTableTabs;
