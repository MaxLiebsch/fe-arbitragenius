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
import { usePaginationAndSort } from "@/hooks/use-pagination-sort";
import { DEFAULT_SORT} from "@/constant/constant";
import Disclaimer from "@/components/Disclaimer";

const Page = () => {
  const [week, setWeek] = React.useState<Week>({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }).getTime(),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }).getTime(),
  });
  const { paginationModel, handleSetSortModel, handleSetPaginationModel } =
    usePaginationAndSort();
  return (
    <div className="h-full flex flex-col overflow-y-hidden relative">
      {/* Header */}
          <Disclaimer />
      <div className="flex flex-col lg:flex-row justify-start lg:justify-between  lg:items-center">
        <Title>Deal Hub</Title>
        <div className="mb-4 lg:mb-0 lg:mt-8">
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
              handleSetSortModel({ field: "none", sort: DEFAULT_SORT });
              handleSetPaginationModel({
                page: 0,
                pageSize: paginationModel.pageSize,
              });
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
