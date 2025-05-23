"use server";
import DailySalesStats from "@/components/DailySalesStats";
import KeepaTasks from "@/components/KeepaTasks";
import ProcessStats from "@/components/ProcessStats";
import ScrapeShopStatsWeek from "@/components/ScrapeShopStatsWeek";
import Terminal from "@/components/Terminal";
import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { IProcessStats } from "@/types/ProcessStats";
import { Task } from "@/types/tasks";
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

  const mongo = await clientPool["NEXT_MONGO_CRAWLER_DATA_ADMIN"];

  const scraper = (
    await mongo
      .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
      .collection("metadata")
      .find({ crawlerId: { $exists: true } })
      .toArray()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const infrastructure = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection("metadata")
    .find({ crawlerId: { $exists: false } })
    .toArray();

  const processStats = (await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection("stats")
    .aggregate([{ $match: { name: "processStats" } }, { $project: { _id: 0 } }])
    .toArray()) as IProcessStats[];

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
        crawlerId: string;
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
        crawlerId: _?.crawlerId || "",
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

  const keepaTasks = tasks
    .filter((task) => task.type === "KEEPA_NORMAL" || task.type === "KEEPA_EAN")
    .reduce<any[]>((acc, task) => {
      //@ts-ignore
      task._id = task._id.toString();
      acc.push(task as unknown as Task);

      return acc;
    }, []);
  const plainTasks = tasks.reduce<Task[]>((acc, task) => {
    if (task.type === "CRAWL_SHOP") {
      //@ts-ignore
      task._id = task._id.toString();
      acc.push(task as unknown as Task);
    }
    return acc;
  }, []);

  const dailySalesPlainTasks = tasks.reduce<Task[]>((acc, task) => {
    if (task.type === "DAILY_SALES") {
      //@ts-ignore
      task._id = task._id.toString();
      task.progress = [];
      acc.push(task as unknown as Task);
    }
    return acc;
  }, []);

  const totalLookupInfos = lookupInfoProgress.reduce(
    (acc: any, _: any) => acc + _.pending,
    0
  );
  const totalQueryEansEby = queryEansEbyProgress.reduce(
    (acc: any, _: any) => acc + _.pending,
    0
  );
  const totalCrawlEans = crawlEansProgress.reduce(
    (acc: any, _: any) => acc + _.pending,
    0
  );
  const totalLookupCategory = lookupCategoryProgress.reduce(
    (acc: any, _: any) => acc + _.pending,
    0
  );
  const totalDealsOnAzn = tasks
    .filter((task) => task.type === "DEALS_ON_AZN")
    .reduce(
      (acc: any, _: any) =>
        acc + _.progress.reduce((acc: any, _: any) => acc + _.pending, 0),
      0
    );

  const totalDealsOnEby = tasks
    .filter((task) => task.type === "DEALS_ON_EBY")
    .reduce(
      (acc: any, _: any) =>
        acc + _.progress.reduce((acc: any, _: any) => acc + _.pending, 0),
      0
    );

  const totalNegEbyDeals = tasks
    .filter((task) => task.type === "CRAWL_EBY_LISTINGS")
    .reduce(
      (acc: any, _: any) =>
        acc + _.progress.reduce((acc: any, _: any) => acc + _.pending, 0),
      0
    );

  const totalNegAznDeals = tasks
    .filter((task) => task.type === "CRAWL_AZN_LISTINGS")
    .reduce(
      (acc: any, _: any) =>
        acc + _.progress.reduce((acc: any, _: any) => acc + _.pending, 0),
      0
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
          <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
            {scraper.length} Scraper
          </h3>
          <div className="grid grid-cols-4 gap-2 w-full md:w-[calc(100vw-400px)] overflow-x-auto">
            {activeCrawler
              .sort((a: any, b: any) => a.task.localeCompare(b.task))
              .map((_) => (
                <Card
                  styles={{
                    body: {
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingBottom: 10,
                    },
                  }}
                  key={_.name}
                  style={{ minWidth: 250, position: "relative" }}
                >
                  <span className="font-semibold absolute left-2 top-2">
                    {_.active ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center">
                      <h3 className="text-md">{_.name}</h3>
                    </div>
                    <p></p>
                    <div className="absolute top-2 right-2">
                      <Terminal ip={_.ip} name={_.crawlerId} />
                    </div>
                    <div className="text-lg">{_.task ? `${_.task}` : ""}</div>
                    <div className="grid grid-cols-4">
                      <p>Usage: </p>
                      <div className="col-span-3">
                        <p>Last 7 days: {_.lastSevenDays}</p>
                        <p>Today: {_.today}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </li>
        {/* PROCESS STATS */}
        <ProcessStats processStats={processStats[0]} />
        {/* INFRASTRUCTURE */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
            {infrastructure.length} Other (Infrastructure)
          </h3>
          <div className="grid grid-cols-4 gap-2 w-full md:w-[calc(100vw-400px)] overflow-x-auto">
            {infrastructure.map((_) => (
              <Card key={_.name} style={{ minWidth: 250 }}>
                <div className="flex flex-col">
                  <p>{_.name}</p>
                  <Terminal ip={_.ip} name={_.name} />
                </div>
              </Card>
            ))}
          </div>
        </li>
        {/* KEEPA */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
            {keepaTasks.length} Keepa Tasks
          </h3>
          <div className="flex flex-col">
            {keepaTotal ? (
              <p>
                Today: {keepaTotal.total} - Yesterday: {keepaTotal.yesterday}{" "}
                (Usage)
              </p>
            ) : (
              <></>
            )}
            <KeepaTasks keepaTasks={keepaTasks} />
          </div>
        </li>
        {/* CRAWL SHOPS */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
            {shops.length} Shops Crawl Shops Total: {total}
          </h3>
          <div>
            <span className="font-semibold">Usage last 7 days:</span>{" "}
            {usagePerTask("CRAWL_SHOP")}{" "}
          </div>
          <div className="grid grid-cols-6 gap-1">
            {shops.map((_) => (
              <Link key={_} href={`/dashboard/admin/overview/${_}`}>
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
            ))}
          </div>
          <ScrapeShopStatsWeek tasks={plainTasks} />
        </li>

        {/* DAILY SALES */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
            {shops.length} Daily Deals Total: {totalSales}
          </h3>
          <div>
            <span className="font-semibold">Usage last 7 days:</span>{" "}
            {usagePerTask("DAILY_SALES")}{" "}
          </div>
          <DailySalesStats tasks={dailySalesPlainTasks} />
        </li>
        {/* MATCH PRODUCTS */}
        <li>
          <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
            Match
          </h3>
          <div>
            {" "}
            <span className="font-semibold">Usage last 7 days:</span>{" "}
            {usagePerTask("MATCH_PRODUCTS")}
          </div>
          {tasks
            .filter((task) => task.type === "MATCH_PRODUCTS")
            .map((_) => (
              <div key={`match-products-${_.id}`}>
                {_.shopDomain.d}: {_.progress.pending}
              </div>
            ))}
        </li>
        <div className="flex flex-col md:flex-row justify-between">
          {/* CRAWL EANS */}
          <li>
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              Crawl Eans
            </h3>
            <div>{totalCrawlEans} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("CRAWL_EAN")}{" "}
            </div>
            {crawlEansProgress.length ? (
              crawlEansProgress.map((_: any) => (
                <div key={`crawl-eans-${_.shop._id}`}>
                  {_.shop.d}: {_.pending}
                </div>
              ))
            ) : (
              <div>All done.</div>
            )}
          </li>
          {/* LOOKUP INFOS */}
          <li>
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              Lookup Infos
            </h3>
            <div>{totalLookupInfos} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("LOOKUP_INFO")}
            </div>
            {lookupInfoProgress?.length ? (
              lookupInfoProgress.map((_: any) => (
                <div key={`lookup-info-${_.shop._id}`}>
                  {_.shop.d}: {_.pending}
                </div>
              ))
            ) : (
              <div>All done.</div>
            )}
          </li>
          {/* QUERY EANS ON EBAY */}
          <li>
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              Query Eans on Ebay
            </h3>
            <div>{totalQueryEansEby} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("QUERY_EANS_EBY")}
            </div>
            {queryEansEbyProgress?.length ? (
              queryEansEbyProgress.map((_: any) => (
                <div key={`query-eans-on-eby-${_.shop._id}`}>
                  {_.shop.d}: {_.pending}
                </div>
              ))
            ) : (
              <div>All done.</div>
            )}
          </li>
          {/* LOOKUP CATEGORY */}
          <li>
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              LookupCategories
            </h3>
            <div>{totalLookupCategory} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("LOOKUP_CATEGORY")}
            </div>
            {lookupCategoryProgress ? (
              lookupCategoryProgress?.map((_: any) => (
                <div key={`lookup-category-${_.shop}`}>
                  {_.shop.d}: {_.pending}
                </div>
              ))
            ) : (
              <div>All done.</div>
            )}
          </li>
        </div>
        {/* DEALS */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* SCRAPE POS LISTINGS AZN */}
          <li>
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              Pos. Margin - Azn
            </h3>
            <div>{totalDealsOnAzn} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("DEALS_ON_AZN")}
            </div>
            {tasks
              .filter((task) => task.type === "DEALS_ON_AZN")
              .sort((a, b) => b.progress.pending - a.progress.pending)
              .map((_) => (
                <div key={`crawl-azn-${_.id}`}>
                  {_?.progress &&
                    _.progress.map(
                      (progressPerShop: {
                        shop: { d: string };
                        pending: number;
                      }) => (
                        <div
                          key={`crawl-azn-${_.id}-${progressPerShop.shop.d}`}
                        >
                          {progressPerShop.shop.d}:{" "}
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
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              Neg. Margin - Azn
            </h3>
            <div>{totalNegAznDeals} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("CRAWL_AZN_LISTINGS")}
            </div>
            {tasks
              .filter((task) => task.type === "CRAWL_AZN_LISTINGS")
              .sort((a, b) => b.progress.pending - a.progress.pending)
              .map((_) => (
                <div key={`crawl-azn-${_.id}`}>
                  {_?.progress &&
                    _.progress.map(
                      (progressPerShop: {
                        shop: { d: string };
                        pending: number;
                      }) => (
                        <div
                          key={`crawl-azn-${_.id}-${progressPerShop.shop.d}`}
                        >
                          {progressPerShop.shop.d}:{" "}
                          {progressPerShop.pending > 0
                            ? `${progressPerShop.pending} pending`
                            : "no pending"}
                        </div>
                      )
                    )}
                </div>
              ))}
          </li>
          {/* SCRAPE POS LISTINGS EBY */}
          <li>
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              Pos. Margin - Eby
            </h3>
            <div>{totalDealsOnEby} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("DEALS_ON_EBY")}
            </div>
            {tasks
              .filter((task) => task.type === "DEALS_ON_EBY")
              .sort((a, b) => b.progress.pending - a.progress.pending)
              .map((_) => (
                <div key={`crawl-eby-${_.id}`}>
                  {_?.progress &&
                    _.progress.map(
                      (progressPerShop: {
                        shop: { d: string };
                        pending: number;
                      }) => (
                        <div
                          key={`crawl-azn-${_.id}-${progressPerShop.shop.d}`}
                        >
                          {progressPerShop.shop.d}:{" "}
                          {progressPerShop.pending > 0
                            ? `${progressPerShop.pending} pending`
                            : "no pending"}
                        </div>
                      )
                    )}
                </div>
              ))}
          </li>
          {/* SCRAPE EBY LISTINGS */}
          <li>
            <h3 className="text-base font-semibold leading-6 text-gray-dark flex flex-row space-x-1 items-center">
              Neg. Margin - Eby
            </h3>
            <div>{totalNegEbyDeals} pending</div>
            <div>
              {" "}
              <span className="font-semibold">Usage last 7 days:</span>{" "}
              {usagePerTask("CRAWL_EBY_LISTINGS")}
            </div>
            {tasks
              .filter((task) => task.type === "CRAWL_EBY_LISTINGS")
              .sort((a, b) => b.progress.pending - a.progress.pending)
              .map((_) => (
                <div key={`crawl-eby-${_.id}`}>
                  {_?.progress &&
                    _.progress.map(
                      (progressPerShop: {
                        shop: { d: string };
                        pending: number;
                      }) => (
                        <div
                          key={`crawl-azn-${_.id}-${progressPerShop.shop.d}`}
                        >
                          {progressPerShop.shop.d}:{" "}
                          {progressPerShop.pending > 0
                            ? `${progressPerShop.pending} pending`
                            : "no pending"}
                        </div>
                      )
                    )}
                </div>
              ))}
          </li>
        </div>
      </ul>
    </>
  );
};

export default Page;
