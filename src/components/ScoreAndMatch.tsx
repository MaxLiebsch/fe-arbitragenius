import { Verification } from "@/types/Product";
import React from "react";


type ScoreAndMatchProps = {
  vrfd?: Verification;
  nmV?: string;
  qtyV?: number;
}

const ScoreAndMatch = (props: ScoreAndMatchProps) => {
  const { vrfd, nmV, qtyV } = props; 
  if (!vrfd) {
    return null;
  }
  const { score, isMatch, qty_score, qty } = vrfd;
  return (
    <div className="text-lg flex flex-row gap-2">
      {score && (
        <div>
          Match-Score: <span className="font-semibold">{score * 100} %</span>
          <span className="text-xs"> ({nmV})</span>
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
          <span className="text-xs"> ({qtyV})</span>
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
