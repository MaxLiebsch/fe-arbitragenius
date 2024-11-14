import { Costs } from "@/types/Product";
import { calculateAznProvision } from "./calcAznProvision";
import { roundToTwoDecimals } from "./roundToTwoDecimals";

export function calcAznCosts(
  costs: Costs,
  costsBaseSellPrice: number,
  sellPrice: number
): number {
  if (costs.prvsn) {
    return roundToTwoDecimals((costs.prvsn / 100) * sellPrice);
  }
  if (costs.azn) {
    const provision = calculateAznProvision(costs.azn, costsBaseSellPrice);
    return roundToTwoDecimals((provision / 100) * sellPrice);
  }
  return 0;
}
