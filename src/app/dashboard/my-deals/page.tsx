"use client";

import Title from "antd/es/typography/Title";
import useBookmarks from "@/hooks/use-bookmarks";
import { Tab } from "@headlessui/react";
import React from "react";
import BookmarkTable from "@/components/BookMarkTable";

const Page = () => {
  const bookMarks = useBookmarks();

  return (
    <div className="h-full">
      <Title>Meine Deals</Title>
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
      </Tab.Group>
    </div>
  );
};

export default Page;
