'use client'
import React, { useRef } from "react";

const KeepaTasks = ({ keepaTasks }: { keepaTasks: any[] }) => {
  const ref = useRef<number>(0);

  return (
    <>
      <div>Total: {ref.current}</div>
      <div className="grid grid-cols-2">
        {keepaTasks.map((_) => (
          <div key={_.id}>
            <p>
              {_.type === "KEEPA_NORMAL" ? "Weekly Updates" : "Ean Updates"}
            </p>
            <div key={`keepa-${_.id}`} className="grid grid-cols-3 gap-2">
              {_?.progress &&
                _.progress
                  .sort((a: any, b: any) => a.d.localeCompare(a.d))
                  .map((progressPerShop: { d: string; pending: number }) => {
                    ref.current += progressPerShop.pending;
                    return (
                      <div key={`crawl-azn-${_.id}-${progressPerShop.d}`}>
                        <span>{progressPerShop.d}: </span>
                        <span>
                          {progressPerShop.pending > 0
                            ? `${progressPerShop.pending} pending`
                            : "no pending"}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default KeepaTasks;
