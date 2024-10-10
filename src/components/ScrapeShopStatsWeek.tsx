"use client";
import { initStatsPerDay } from "@/constant/constant";
import { SplitStats } from "@/types/admin/initSplitStats";
import { Card } from "antd";
import { format, parseISO } from "date-fns";
import React, { useEffect } from "react";

const ScrapeShopStatsWeek = ({ tasks }: { tasks: any[] }) => {
  const [stats, setStats] = React.useState<SplitStats | null>(null);

  const todayWeekday = new Date().getDay().toString();
  const todayDayMonth = format(new Date(), "dd-MM");
  useEffect(() => {
    setStats(null);
    if (tasks && tasks.length) {
      const updatedStats = tasks.reduce((acc, task) => {
        const { weekday, productLimit, id, shopDomain, completedAt } = task;
        acc[weekday].total += productLimit;
        acc[weekday].tasks.push({
          id,
          shopDomain,
          completedAt,
        });
        return acc;
      }, initStatsPerDay);
      setStats(updatedStats);
    }
  }, []);

  return (
    <div className="flex flex-row gap-2">
      {stats && (
        <>
          {Object.entries(stats).map(([weekday, { total, tasks }]) => (
            <Card key={weekday} style={{ width: 300 }}>
              <div className="flex flex-col">
                <h2
                  className={`${
                    weekday === todayWeekday ? "font-semibold" : ""
                  }`}
                >
                  {format(new Date(0, 0, Number(weekday)), "EEEE")}:{" "}
                  <div className="text-xs">{total}</div>{" "}
                </h2>
                <h3>Tasks per Day: {tasks.length}</h3>
                {tasks.map((task) => {
                  const date = parseISO(
                    task.completedAt || new Date().toISOString()
                  );
                  const dayMonth = format(date, "dd-MM");
                  const taskWeekday = date.getDay().toString();
                  return (
                    <div key={task.id}>
                      {task.shopDomain}:
                      {task.id.replace(`crawl_shop_${task.shopDomain}_`, "")}:{" "}
                      {weekday === todayWeekday ? (
                        <>
                          {dayMonth === todayDayMonth ? (
                            <span className="font-semibold text-green-500">
                              Done
                            </span>
                          ) : (
                            <span className="font-semibold text-yellow-300">
                              Pending
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {taskWeekday === weekday ? (
                            <span>Completed</span>
                          ) : (
                            <span className="font-semibold text-red-500">
                              Not completed
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default ScrapeShopStatsWeek;
