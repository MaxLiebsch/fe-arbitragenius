import { getLoggedInUser } from "@/server/appwrite";
import { mongoAdminPromise } from "@/server/mongo";
import { Card } from "antd";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface activityPeriods {
  [date: string]: {
    [type: string]: { activeTime: number };
  };
}

const Page = async () => {
  const user = await getLoggedInUser();

  if (!user?.labels.includes("admin")) redirect("/");

  const mongo = await mongoAdminPromise;

  const crawler = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection("metadata")
    .find({})
    .toArray();

  const tasks = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection("tasks")
    .find({})
    .toArray();

  const shops = tasks
    .filter((task) => task.type === "CRAWL_SHOP" && !task.maintenance)
    .reduce((acc: string[], _) => {
      acc = [...new Set([...acc, _.shopDomain])];
      return acc;
    }, []);

  const total = tasks
    .filter((task) => task.type === "CRAWL_SHOP" && !task.maintenance)
    .reduce((acc, _) => acc + _.productLimit, 0);

  const activeCrawler = crawler.reduce(
    (
      acc: {
        active: boolean;
        lastSevenDays: string;
        today: string;
        task: string;
        name: string;
      }[],
      _
    ) => {
      const task = tasks.find((task) =>
        task.lastCrawler?.includes(_.crawlerId)
      );

      let today = format(new Date(), "yyyy-MM-dd");
      let totalToday = 0;

      const lastSevenDays = Object.entries(
        _.activityPeriods as activityPeriods
      ).reduce((acc, [date, types], i) => {
        const day = Object.values(types).reduce((acc, type) => {
          acc += type.activeTime;
          return acc;
        }, 0);

        if (date == today) {
          totalToday = day / 1000 / 60 / 60;
        }
        acc += day;
        return acc;
      }, 0);

      const cntDays =
        Object.keys(_.activityPeriods as activityPeriods).length *
        24 *
        60 *
        60 *
        1000;

      acc.push({
        active: task ? true : false,
        task: task?.id ?? "",
        lastSevenDays: `${((lastSevenDays / cntDays) * 100).toFixed(2)} %`,
        today: `${totalToday.toFixed(2)} h`,
        name: _.crawlerId,
      });

      return acc;
    },
    []
  );

  const usagePerTask = (taskType: string) => {
    const { zaehler, nenner } = crawler.reduce(
      (acc: { nenner: number; zaehler: number }, _) => {
        const lastSevenDays = Object.entries(
          _.activityPeriods as activityPeriods
        ).reduce((acc, [date, types], i) => {
          const day = Object.entries(types)
            .filter(([type, val]) => type === taskType)
            .reduce((acc, [type, val]) => {
              acc += val.activeTime;
              return acc;
            }, 0);
          acc += day;
          return acc;
        }, 0);

        const cntDays =
          Object.keys(_.activityPeriods as activityPeriods).length *
          24 *
          60 *
          60 *
          1000;

        acc.nenner += cntDays;
        acc.zaehler += lastSevenDays;
        return acc;
      },
      { nenner: 0, zaehler: 0 }
    );

    return `${((zaehler / nenner) * 100).toFixed(2)} %`;
  };

  const lookupInfoProgress = tasks.find(
    (task) => task.type === "LOOKUP_INFO"
  )!.progress;
  const lookupCategoryProgress = tasks.find(
    (task) => task.type === "LOOKUP_CATEGORY"
  )!.progress;
  const queryEansEbyProgress = tasks.find(
    (task) => task.type === "QUERY_EANS_EBY"
  )!.progress;
  const crawlEansProgress = tasks.find(
    (task) => task.type === "CRAWL_EAN"
  )!.progress;

  return (
    <ul>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          {crawler.length} Crawlers
        </h3>
        <div className="flex gap-2">
          {activeCrawler.map((_) => (
            <Card key={_.name} style={{ width: 500 }}>
              <p>
                {_.name}:{" "}
                <span className="font-semibold">
                  {_.active ? "Active" : "Inactive"}
                </span>
              </p>
              {_.task ? `Task: ${_.task}` : ""}
              <div>
                <p>Usage: </p>
                <p>Last 7 days: {_.lastSevenDays}</p>
                <p>Today: {_.today}</p>
              </div>
            </Card>
          ))}
        </div>
      </li>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          {shops.length} Shops Crawl Shops Total: {total}
        </h3>
        <div> Usage last 7 days: {usagePerTask("CRAWL_SHOP")} </div>
        <div className="flex gap-2">
          {shops.map((_) => (
            <Card key={_} style={{ width: 300 }}>
              <Link href={`/dashboard/admin/overview/${_}`}>
                <>
                  <p>{_}</p>
                  <p>
                    {tasks
                      .filter(
                        (task) =>
                          task.shopDomain === _ &&
                          task.type === "CRAWL_SHOP" &&
                          !task.maintenance
                      )
                      .reduce((acc, _) => acc + _.productLimit, 0)}
                  </p>
                </>
              </Link>
            </Card>
          ))}
        </div>
      </li>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          Match
        </h3>
        <div> Usage last 7 days: {usagePerTask("MATCH_PRODUCTS")}</div>
        {tasks
          .filter((task) => task.type === "MATCH_PRODUCTS")
          .map((_) => (
            <div key={`match-products-${_.id}`}>
              {_.shopDomain}: {_.progress.pending}
            </div>
          ))}
      </li>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          Crawl Eans
        </h3>
        <div> Usage last 7 days: {usagePerTask("CRAWL_EAN")} </div>
        {crawlEansProgress.length ? (
          crawlEansProgress.map((_: any) => (
            <div key={`crawl-eans-${_.shop}`}>
              {_.shop}: {_.pending}
            </div>
          ))
        ) : (
          <div>All done.</div>
        )}
      </li>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          Lookup Infos
        </h3>
        <div> Usage last 7 days: {usagePerTask("LOOKUP_INFO")}</div>
        {lookupInfoProgress.length ? (
          lookupInfoProgress.map((_: any) => (
            <div key={`lookup-info-${_.shop}`}>
              {_.shop}: {_.pending}
            </div>
          ))
        ) : (
          <div>All done.</div>
        )}
      </li>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          Query Eans on Ebay
        </h3>
        <div> Usage last 7 days: {usagePerTask("QUERY_EANS_EBY")}</div>
        {queryEansEbyProgress.length ? (
          queryEansEbyProgress.map((_: any) => (
            <div key={`query-eans-on-eby-${_.shop}`}>
              {_.shop}: {_.pending}
            </div>
          ))
        ) : (
          <div>All done.</div>
        )}
      </li>

      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          LookupCategories
        </h3>
        <div> Usage last 7 days: {usagePerTask("LOOKUP_CATEGORY")}</div>
        {lookupCategoryProgress ? (
          lookupCategoryProgress.map((_: any) => (
            <div key={`lookup-category-${_.shop}`}>
              {_.shop}: {_.pending}
            </div>
          ))
        ) : (
          <div>All done.</div>
        )}
      </li>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          Crawl Azn Listings
        </h3>
        <div> Usage last 7 days: {usagePerTask("CRAWL_AZN_LISTINGS")}</div>
        {tasks
          .filter((task) => task.type === "CRAWL_EBY_LISTINGS")
          .sort((a, b) => b.progress.pending - a.progress.pending)
          .map((_) => (
            <div key={`lookup-category-${_.id}`}>
              {_.shopDomain}:{" "}
              {_.progress.pending > 0
                ? `${_.progress.pending} pending`
                : "no pending"}
            </div>
          ))}
      </li>
      <li>
        <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
          Crawl Eby Listings
        </h3>
        <div> Usage last 7 days: {usagePerTask("CRAWL_AZN_LISTINGS")}</div>
        {tasks
          .filter((task) => task.type === "CRAWL_AZN_LISTINGS")
          .sort((a, b) => b.progress.pending - a.progress.pending)
          .map((_) => (
            <div key={`lookup-category-${_.id}`}>
              {_.shopDomain}:{" "}
              {_.progress.pending > 0
                ? `${_.progress.pending} pending`
                : "no pending"}
            </div>
          ))}
      </li>
    </ul>
  );
};

export default Page;
