import { appendPercentage } from "@/util/formatter";
import React from "react";

const MargePercentage = ({
  buyPrc,
  sellPrc,
  mrgnPct,
}: {
  buyPrc: number;
  sellPrc: number;
  mrgnPct: any;
}) => {
  return <div>{appendPercentage(mrgnPct)}</div>;
};

export default MargePercentage;
