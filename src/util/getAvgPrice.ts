import { ModifiedProduct } from "@/types/Product";
import { roundToTwoDecimals } from "./roundToTwoDecimals";

export const getAvgPrice = (product: ModifiedProduct) => {
  let avgPrice = 0;
  const { avg30_ansprcs, avg30_ahsprcs, avg90_ahsprcs, avg90_ansprcs } =
    product;
  if (avg30_ahsprcs && avg30_ahsprcs > 0) {
    avgPrice = avg30_ahsprcs;
  } else if (avg30_ansprcs && avg30_ansprcs > 0) {
    avgPrice = avg30_ansprcs;
  } else if (avg90_ahsprcs && avg90_ahsprcs > 0) {
    avgPrice = avg90_ahsprcs;
  } else if (avg90_ansprcs && avg90_ansprcs > 0) {
    avgPrice = avg90_ansprcs;
  }

  avgPrice = roundToTwoDecimals(avgPrice / 100);
  return avgPrice;
};
