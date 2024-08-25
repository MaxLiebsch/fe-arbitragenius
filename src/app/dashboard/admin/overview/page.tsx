import PasswordPrompt from "@/components/PasswordPrompt";
import Terminal from "@/components/Terminal";
import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { Button, Card } from "antd";
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

  const mongo = await clientPool["NEXT_MONGO_CRAWLER_DATA_ADMIN"];

  const scraper = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection("metadata")
    .find({ crawlerId: { $exists: true } })
    .toArray();

  const infrastructure = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection("metadata")
    .find({ crawlerId: { $exists: false } })
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

  const totalSales = tasks
    .filter((task) => task.type === "DAILY_SALES" && !task.maintenance)
    .reduce((acc, _) => acc + _.productLimit, 0);

  const activeCrawler = scraper.reduce(
    (
      acc: {
        active: boolean;
        lastSevenDays: string;
        today: string;
        task: string;
        name: string;
        ip: string;
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
        name: _.name,
        ip: _.ip,
      });

      return acc;
    },
    []
  );

  const usagePerTask = (taskType: string) => {
    const { zaehler, nenner } = scraper.reduce(
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

  const keepaTasks = tasks.filter(
    (task) => task.type === "KEEPA_NORMAL" || task.type === "KEEPA_EAN"
  );

  const keepaTotal = keepaTasks.reduce((acc, task) => {
    if (task.type === "KEEPA_NORMAL") {
      acc = {
        total: task.total,
        yesterday: task.yesterday,
      };
    }
    return acc;
  }, {} as { total: number; yesterday: number });

  return (
    <>
      <ul>
        {/* SCRAPER */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            {scraper.length} Scraper
          </h3>
          <div className="flex gap-2 w-[calc(100vw-400px)] overflow-x-auto">
            {activeCrawler.map((_) => (
              <Card key={_.name} style={{ minWidth: 250 }}>
                <div className="flex flex-col">
                  <p>
                    {_.name}:{" "}
                    <span className="font-semibold">
                      {_.active ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <Terminal ip={_.ip} />
                  {_.task ? `Task: ${_.task}` : ""}
                  <div>
                    <p>Usage: </p>
                    <p>Last 7 days: {_.lastSevenDays}</p>
                    <p>Today: {_.today}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </li>
        {/* INFRASTRUCTURE */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            {infrastructure.length} Other (Infrastructure)
          </h3>
          <div className="flex gap-2 w-[calc(100vw-400px)] overflow-x-auto">
            {infrastructure.map((_) => (
              <Card key={_.name} style={{ minWidth: 250 }}>
                <div className="flex flex-col">
                  <p>{_.name}</p>
                  <Terminal ip={_.ip} />
                </div>
              </Card>
            ))}
          </div>
        </li>
        {/* KEEPA */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            {keepaTasks.length} Keepa Tasks
          </h3>
          <div className="flex flex-col">
            {keepaTotal ? (
              <p>
                Today: {keepaTotal.total} - Yesterday: {keepaTotal.yesterday} (Usage)
              </p>
            ) : (
              <></>
            )}
            <div className="flex flex-row gap-2">
              {keepaTasks.map((_) => (
                <Card key={_.id}>
                  <p>
                    {_.type === "KEEPA_NORMAL"
                      ? "Weekly Updates"
                      : "Ean Updates"}
                  </p>
                  <div key={`keepa-${_.id}`}>
                    {_?.progress &&
                      _.progress.map(
                        (progressPerShop: { d: string; pending: number }) => (
                          <div key={`crawl-azn-${_.id}-${progressPerShop.d}`}>
                            {progressPerShop.d}:{" "}
                            {progressPerShop.pending > 0
                              ? `${progressPerShop.pending} pending`
                              : "no pending"}
                          </div>
                        )
                      )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </li>
        {/* CRAWL SHOPS */}
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
        {/* DAILY SALES */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            {shops.length} Daily Deals Total: {totalSales}
          </h3>
          <div> Usage last 7 days: {usagePerTask("DAILY_SALES")} </div>
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
                            task.type === "DAILY_SALES" &&
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
        {/* MATCH PRODUCTS */}
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
        {/* CRAWL EANS */}
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
        {/* LOOKUP INFOS */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            Lookup Infos
          </h3>
          <div> Usage last 7 days: {usagePerTask("LOOKUP_INFO")}</div>
          {lookupInfoProgress?.length ? (
            lookupInfoProgress.map((_: any) => (
              <div key={`lookup-info-${_.shop}`}>
                {_.shop}: {_.pending}
              </div>
            ))
          ) : (
            <div>All done.</div>
          )}
        </li>
        {/* QUERY EANS ON EBAY */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            Query Eans on Ebay
          </h3>
          <div> Usage last 7 days: {usagePerTask("QUERY_EANS_EBY")}</div>
          {queryEansEbyProgress?.length ? (
            queryEansEbyProgress.map((_: any) => (
              <div key={`query-eans-on-eby-${_.shop}`}>
                {_.shop}: {_.pending}
              </div>
            ))
          ) : (
            <div>All done.</div>
          )}
        </li>
        {/* LOOKUP CATEGORY */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            LookupCategories
          </h3>
          <div> Usage last 7 days: {usagePerTask("LOOKUP_CATEGORY")}</div>
          {lookupCategoryProgress ? (
            lookupCategoryProgress?.map((_: any) => (
              <div key={`lookup-category-${_.shop}`}>
                {_.shop}: {_.pending}
              </div>
            ))
          ) : (
            <div>All done.</div>
          )}
        </li>
        {/* SCRAPE EBY LISTINGS */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            Negative Margin Products - Eby
          </h3>
          <div> Usage last 7 days: {usagePerTask("CRAWL_EBY_LISTINGS")}</div>
          {tasks
            .filter((task) => task.type === "CRAWL_EBY_LISTINGS")
            .sort((a, b) => b.progress.pending - a.progress.pending)
            .map((_) => (
              <div key={`crawl-eby-${_.id}`}>
                {_?.progress &&
                  _.progress.map(
                    (progressPerShop: { d: string; pending: number }) => (
                      <div key={`crawl-azn-${_.id}-${progressPerShop.d}`}>
                        {progressPerShop.d}:{" "}
                        {progressPerShop.pending > 0
                          ? `${progressPerShop.pending} pending`
                          : "no pending"}
                      </div>
                    )
                  )}
              </div>
            ))}
        </li>
        {/* SCRAPE AZN LISTINGS */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            Negative Margin Products - Azn
          </h3>
          <div> Usage last 7 days: {usagePerTask("CRAWL_AZN_LISTINGS")}</div>
          {tasks
            .filter((task) => task.type === "CRAWL_AZN_LISTINGS")
            .sort((a, b) => b.progress.pending - a.progress.pending)
            .map((_) => (
              <div key={`crawl-azn-${_.id}`}>
                {_?.progress &&
                  _.progress.map(
                    (progressPerShop: { d: string; pending: number }) => (
                      <div key={`crawl-azn-${_.id}-${progressPerShop.d}`}>
                        {progressPerShop.d}:{" "}
                        {progressPerShop.pending > 0
                          ? `${progressPerShop.pending} pending`
                          : "no pending"}
                      </div>
                    )
                  )}
              </div>
            ))}
        </li>
      </ul>
    </>
  );
};

export default Page;
