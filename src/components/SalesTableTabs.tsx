"use client";

import { Tab } from "@headlessui/react";
import React from "react";
import SalesTable from "./SalesTable";
import SourceshopTabGroup from "./SourceshopTabGroup";
import Disclaimer from "./Disclaimer";

const SalesTableTabs = () => {


  return (
    <div className="relative">
      <SourceshopTabGroup>
        <>
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
