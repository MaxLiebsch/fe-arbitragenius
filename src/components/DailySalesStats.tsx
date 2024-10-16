"use client";
import React, { useEffect } from "react";

const DailySalesStats = ({ tasks }: { tasks: any[] }) => {
  const today = new Date().getDay().toString();
  return (
    <div className="py-3">
      <div className="flex flex-col">
        <div>Legend</div>
        <div>{`(last Total / current Limit / estimated)`}</div>
      </div>
      <div className="grid grid-cols-3">
        <>
          {tasks
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((task) => {
              const date = new Date(task.completedAt).getDay().toString();
              return (
                <div key={task.id}>
                  <div className="flex flex-row gap-1">
                    <span>{task.id} </span>
                    {date === today ? (
                      <span className="text-green-400">Done</span>
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
                  </div>
                  <div>
                    <span
                      className={`${
                        task.lastTotal / task.productLimit < 0.9
                          ? "text-red-500"
                          : "text-green-400"
                      }`}
                    >
                      {task.lastTotal}
                    </span>
                    /<span>{task.productLimit}/</span>
                    <span> {task.estimatedProducts}</span>
                  </div>
                </div>
              );
            })}
        </>
      </div>
    </div>
  );
};

export default DailySalesStats;
