"use client";

import { Tab } from "@headlessui/react";
import React from "react";
import SalesTable from "./SalesTable";
import SourceshopTabGroup from "./SourceshopTabGroup";

const SalesTableTabs = () => {


  return (
    <div className="relative">
      <SourceshopTabGroup>
        <>
          <div className="absolute text-gray-dark text-xs right-0 top-[1.25rem]">
            DipMax Export GmbH übernimmt für die dargestellten Informationen und
            deren Genauigkeit und Vollständigkeit keine Gewährleistung.
          </div>
          <Tab.Panels className="flex h-[calc(100vh-198px)]">
            <Tab.Panel className="w-full  h-full">
              <SalesTable target="a" />
            </Tab.Panel>
            <Tab.Panel className="w-full h-full">
              <SalesTable target="e" />
            </Tab.Panel>
          </Tab.Panels>
        </>
      </SourceshopTabGroup>
      
    </div>
  );
};

export default SalesTableTabs;
