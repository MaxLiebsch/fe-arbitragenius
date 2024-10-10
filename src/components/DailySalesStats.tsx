"use client";
import React, { useEffect } from "react";

const DailySalesStats = ({ tasks }: { tasks: any[] }) => {
  const today = new Date().getDay().toString();
  return (
    <div className="flex flex-col">
      <>
        {tasks.map((task) => {
          const date = new Date(task.completedAt).getDay().toString();
          return (
            <div key={task._id} className="flex flex-row gap-1">
              <span>{task.shopDomain} </span>
              {date === today ? (
                <span className="text-green-400">Done</span>
              ) : (
                <span className="text-red-400">Not done</span>
              )}
            </div>
          );
        })}
      </>
    </div>
  );
};

export default DailySalesStats;
