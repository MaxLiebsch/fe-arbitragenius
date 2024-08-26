import { Verification } from "@/types/Product";
import React from "react";

const ScoreAndMatch = ({ score, isMatch }: Verification) => {
  return (
    <div className="text-lg flex flex-row gap-2">
      {score && (
        <div>
          Score: <span className="font-semibold">{score * 100} %</span>
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
    </div>
  );
};

export default ScoreAndMatch;
