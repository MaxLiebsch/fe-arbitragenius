"use client";
import Title from "antd/es/typography/Title";
import React from "react";
import { DatePicker } from "antd";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
const MyDatePicker = DatePicker.generatePicker<Date>(dateFnsGenerateConfig);
import locale from "antd/es/date-picker/locale/de_DE";
import { endOfDay, endOfWeek, startOfWeek } from "date-fns";
import SourceshopTabGroup from "@/components/SourceshopTabGroup";
import { Week } from "@/types/Week";
import { Tab } from "@headlessui/react";
import DealHubTablePanel from "@/components/DealHubTablePanel";

const Page = () => {
  const [week, setWeek] = React.useState<Week>({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }).getTime(),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }).getTime(),
  });
  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Title>Deal Hub</Title>
        <div>
          <MyDatePicker
            style={{ width: 300 }}
            prefix="Ausgewählte Woche: "
            defaultValue={week.start}
            locale={locale}
            minDate={new Date("2024-05-13")}
            maxDate={endOfDay(new Date())}
            onChange={(value) => {
              if (value === null) {
                return;
              }
              setWeek({
                start: startOfWeek(value, { weekStartsOn: 1 }).getTime(),
                end: endOfWeek(value, { weekStartsOn: 1 }).getTime(),
              });
            }}
            picker="week"
          />
        </div>
      </div>
      {/* Content */}
      <SourceshopTabGroup>
        <div className="relative">
          <div className="absolute text-gray-dark text-xs right-0 -top-[0.85rem]">
            DipMax Export GmbH übernimmt für die dargestellten Informationen und
            deren Genauigkeit und Vollständigkeit keine Gewährleistung.
          </div>
          <Tab.Panels className="flex h-[calc(100vh-220px)]">
            <Tab.Panel className="w-full  h-full">
              <DealHubTablePanel week={week} target="a" />
            </Tab.Panel>
            <Tab.Panel className="w-full h-full">
              <DealHubTablePanel week={week} target="e" />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </SourceshopTabGroup>
    </div>
  );
};

export default Page;
