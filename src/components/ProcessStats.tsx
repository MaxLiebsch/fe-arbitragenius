"use client";
import { IProcessStats } from "@/types/ProcessStats";
import React from "react";

const ProcessStats = ({ processStats }: { processStats: IProcessStats }) => {
  console.log("processStats:", processStats);
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center">
        ProcessStats
      </h3>
      <div className="grid grid-cols-3">
        <ul className="col-span-1">
          <h3 className="text-base font-medium leading-6 text-gray-900 flex flex-row space-x-1 items-center">
            Last24h:
          </h3>{" "}
          {Object.keys(processStats.last24hStats).map((stat) => (
            <li key={stat}>
              {stat}
              {": "}
              {
                processStats.last24hStats[
                  stat as keyof typeof processStats.last24hStats
                ]
              }
            </li>
          ))}
        </ul>
        <div className="flex flex-row gap-2 col-span-2">
          {Object.keys(processStats)
            .filter(
              (key) =>
                key !== "distinctProducts" &&
                key !== "last24hStats" &&
                key !== "name"
            )
            .map((stat, i) => (
              <div key={stat + i}>
                <h3 className="text-base font-medium leading-6 text-gray-900 flex flex-row space-x-1 items-center">
                  {stat}
                </h3>
                {Object.keys(
                  processStats[stat as keyof typeof processStats]
                ).map((prop, i) => (
                  <div key={stat + prop + i}>
                    <span className="font-semibold">{prop}</span>
                    {": "}
                    {
                      (processStats[stat as keyof typeof processStats] as any)[
                        prop
                      ]
                    }
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessStats;
