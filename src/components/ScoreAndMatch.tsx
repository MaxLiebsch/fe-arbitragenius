import { Verification } from "@/types/Product";
import React from "react";

const ScoreAndMatch = ({ score, isMatch, qty, qty_score }: Verification) => {
  return (
    <div className="text-lg flex flex-row gap-2">
      {score && (
        <div>
          Match-Score: <span className="font-semibold">{score * 100} %</span>
        </div>
      )}
      {score && (
        <div className="font-semibold">
          {typeof isMatch === "boolean" && isMatch ? (
            <div className="text-green-500">Match!</div>
          ) : (
            <div className="text-red-600">No Match!</div>
          )}
        </div>
      )}
      {qty_score && (
        <div>
          Quantity-Score: <span className="font-semibold">{qty_score * 100} %</span>
        </div>
      )}
      {
        <div>
          {qty && (
            <div>
              Qty: <span className="font-semibold">{qty}</span>
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default ScoreAndMatch;
