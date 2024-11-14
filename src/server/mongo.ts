import { PRODUCT_COL } from "@/constant/constant";
import clientPool from "./mongoPool";

export const getProductCol = async () => {
  const mongo = await clientPool["NEXT_MONGO"];
  const productCol = mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(PRODUCT_COL);

  return productCol;
};
