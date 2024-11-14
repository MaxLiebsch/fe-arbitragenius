"use client";
import { initStatsPerDay } from "@/constant/constant";
import { SplitStats } from "@/types/admin/initSplitStats";
import { Card } from "antd";
import { format, parseISO, sub } from "date-fns";
import React, { useEffect, useState } from "react";

const ScrapeShopStatsWeek = ({ tasks }: { tasks: any[] }) => {
  const [stats, setStats] = React.useState<SplitStats | null>(null);
  const [orderedWeekdays, setOrderedWeekdays] = useState<string[]>([]);

  const todayWeekday = new Date().getDay().toString();
  const todayDayMonth = format(new Date(), "dd-MM");
  useEffect(() => {
    setStats(null);
    if (tasks && tasks.length) {
      const updatedStats = tasks.reduce((acc, task) => {
        const {
          weekday,
          productLimit,
          id,
          executing,
          shopDomain,
          completedAt,
          lastTotal,
          estimatedProducts,
        } = task;
        acc[weekday].total += productLimit;
        acc[weekday].tasks.push({
          id,
          lastTotal,
          productLimit,
          executing,
          lastCrawler: task.lastCrawler,
          estimatedProducts,
          shopDomain,
          completedAt,
        });
        return acc;
      }, initStatsPerDay);

      const reorderedStats: SplitStats = {};
      const weekdaysOrder: string[] = [];
      if (updatedStats[todayWeekday]) {
        reorderedStats[todayWeekday] = updatedStats[todayWeekday];
        weekdaysOrder.push(todayWeekday);
      }

      for (let i = 1; i < 7; i++) {
        const nextWeekday = (Number(todayWeekday) + i) % 7;
        if (updatedStats[nextWeekday]) {
          weekdaysOrder.push(nextWeekday.toString());
        }
      }

      Object.keys(updatedStats).forEach((weekday) => {
        if (weekday !== todayWeekday) {
          reorderedStats[weekday] = updatedStats[weekday];
        }
      });

      setStats(reorderedStats);
      setOrderedWeekdays(weekdaysOrder);
    }
  }, []);

  return (
    <div className="py-3">
      <div className="flex flex-col">
        <div>Legend</div>
        <div>{`(last Total / current Limit / estimated)`}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats && (
          <>
            {orderedWeekdays.map((weekday) => {
              const { total, tasks } = stats[weekday];
              return (
                <div key={weekday} className="flex flex-col">
                  <h2
                    className={`${
                      weekday === todayWeekday ? "font-semibold" : ""
                    }`}
                  >
                    {format(new Date(0, 0, Number(weekday)), "EEEE")}
                    {` (${total})`}:
                  </h2>
                  <h3>Tasks per Day: {tasks.length}</h3>
                  {tasks.sort((a, b) => a.id.localeCompare(b.id)).map((task) => {
                    const date = parseISO(
                      task.completedAt ||
                        sub(new Date(), { days: 30 }).toISOString()
                    );
                    const dayMonth = format(date, "dd-MM");
                    const taskWeekday = date.getDay().toString();
                    return (
                      <div key={task.id}>
                        <div className="flex flex-col">
                          <div className="font-medium">
                            {task.id} :{" "}
                            {weekday === todayWeekday ? (
                              <>
                                {dayMonth === todayDayMonth ? (
                                  <span className="font-semibold text-green-500">
                                    Done
                                  </span>
                                ) : (
                                  <>
                                    {task.executing ? (
                                      <span className="font-semibold text-teal-400">
                                        Executing by {task.lastCrawler[0]}
                                      </span>
                                    ) : (
                                      <span className="font-semibold text-yellow-300">
                                        Pending
                                      </span>
                                    )}
                                  </>
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
                        </div>
                        <div>
                          <span
                            className={`${
                              task.lastTotal / task.productLimit < 0.9
                                ? "text-red-500"
                                : "text-green-400"
                            }`}
                          >
                            {task.lastTotal}/
                          </span>
                          <span>{task.productLimit}/</span>
                          <span> {task.estimatedProducts}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ScrapeShopStatsWeek;
