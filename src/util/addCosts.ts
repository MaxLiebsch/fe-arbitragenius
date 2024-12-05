import { roundToTwoDecimals } from "./roundToTwoDecimals";

export const addCosts = (costs: number[]) => {
  return (
    roundToTwoDecimals(
      costs.reduce((acc, cost) => {
        if (cost > 0) {
          return acc + Math.round(cost * 100);
        }
        return acc;
      }, 0)
    ) / 100
  );
};
