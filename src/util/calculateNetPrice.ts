import { roundToTwoDecimals } from "./roundToTwoDecimals";

export const calculateNetPrice = (price: number, tax?: number): number => {
  return roundToTwoDecimals(price / (1 + (tax || 19) / 100));
};
