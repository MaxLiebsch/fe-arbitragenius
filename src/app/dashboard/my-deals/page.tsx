"use client";

import Title from "antd/es/typography/Title";
import useBookmarks from "@/hooks/use-bookmarks";
import { Tab } from "@headlessui/react";
import React from "react";
import BookmarkTable from "@/components/BookMarkTable";
import SourceshopTabGroup from "@/components/SourceshopTabGroup";

const Page = () => {
  const bookMarks = useBookmarks();

  return (
    <div className="h-full relative">
      <Title>Meine Deals</Title>
      <SourceshopTabGroup>
        <>
          <div className="absolute text-gray-dark text-xs right-0 top-[5.2rem]">
            DipMax Export GmbH übernimmt für die dargestellten Informationen und
            deren Genauigkeit und Vollständigkeit keine Gewährleistung.
          </div>
          <Tab.Panels className="flex h-[calc(100vh-195px)]">
            <Tab.Panel className="w-full  h-full">
              <BookmarkTable
                products={bookMarks.data?.a ?? []}
                target="a"
                loading={bookMarks.isLoading}
              />
            </Tab.Panel>
            <Tab.Panel className="w-full h-full">
              <BookmarkTable
                products={bookMarks.data?.e ?? []}
                target="e"
                loading={bookMarks.isLoading}
              />
            </Tab.Panel>
          </Tab.Panels>
        </>
      </SourceshopTabGroup>
    </div>
  );
};

export default Page;
