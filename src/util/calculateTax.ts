import { roundToTwoDecimals } from "./roundToTwoDecimals";

export const calculateTax = (price: number, tax?: number): number => {
  return roundToTwoDecimals(price - price / (1 + (tax || 19) / 100));
};
