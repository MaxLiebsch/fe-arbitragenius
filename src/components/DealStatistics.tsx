import useDealhubProductCount from "@/hooks/use-dealhub-count";
import useSalesCount from "@/hooks/use-sales-count";
import { Week } from "@/types/Week";
import { Divider } from "antd";
import { endOfWeek, startOfWeek } from "date-fns";
import Link from "next/link";
import React from "react";

const DealStatistics = () => {
  return (
    <div className="flex flex-col lg:flex-row my-auto gap-2">
      <WeekelyStatistics />
      <SalesStatistics />
    </div>
  );
};

const Statistics = ({
  statistics,
  title,
  path,
}: {
  title: string;
  path: string;
  statistics: { target: string; total: number | undefined }[];
}) => {
  return (
    <div>
      <div className="text-secondary text-nowrap px-2 lg:px-4">{title}</div>
      <Divider className="!m-0" />
      <div className="flex flex-row gap-2 justify-start lg:justify-evenly px-2 lg:px-4">
        {statistics.map((stat, i) => {
          return (
            <Link
              key={i + stat.target + path}
              className="text-secondary"
              href={`/dashboard/${path}?target=${stat.target.toLowerCase()}`}
            >
              <div className="font-semibold flex flex-row hover:font-bold justify-center">
                <span>{stat.target}:{" "}</span>
                {stat.total || 0}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const SalesStatistics = () => {
  const eSalesCount = useSalesCount("e");
  const aSalesCount = useSalesCount("a");
  const newDeals = Boolean(
    eSalesCount.data?.totalProductsToday || aSalesCount.data?.totalProductsToday
  );
  return (
    <>
      {newDeals ? (
        <Statistics
          path="daily-deals"
          title="Neue Sales-Deals Heute"
          statistics={[
            { target: "Amazon", total: aSalesCount.data?.totalProductsToday },
            { target: "Ebay", total: eSalesCount.data?.totalProductsToday },
          ]}
        />
      ) : null}
    </>
  );
};

const WeekelyStatistics = () => {
     const [week] = React.useState<Week>({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }).getTime(),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }).getTime(),
      });
     const aproductCountQuery = useDealhubProductCount('a', week);
     const eproductCountQuery = useDealhubProductCount('e', week);
     const newDeals = Boolean(
        eproductCountQuery.data?.productCount || aproductCountQuery.data?.productCount
      );
      return (
        <>
          {newDeals ? (
            <Statistics
              path="deal-hub"
              title="Neue Deals diese Woche"
              statistics={[
                { target: "Amazon", total: aproductCountQuery.data?.productCount },
                { target: "Ebay", total:  eproductCountQuery.data?.productCount },
              ]}
            />
          ) : null}
        </>
      );
};

export default DealStatistics;
