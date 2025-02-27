import { keepaProperties } from "./keepaProperties";

export const resetAznProductQuery = () => {
  let query: { [key: string]: any } = {
    $unset: {
      //standard properties
      a_pblsh: "",
      a_nm: "",
      a_cur: "",
      bsr: "",
      a_img: "",
      asin: "",
      a_prc: "",
      costs: "",
      a_uprc: "",
      a_qty: "",
      a_orgn: "",
      a_rating: "",
      a_reviewcnt: "",
      a_hash: "",
      tax: "",
      a_mrgn: "",
      a_mrgn_pct: "",
      a_w_mrgn: "",
      a_w_mrgn_pct: "",
      a_p_w_mrgn: "",
      a_p_w_mrgn_pct: "",
      a_p_mrgn: "",
      a_vrfd: "",
      a_p_mrgn_pct: "",
      // lockup info
      info_prop: "",
      // keepa properties
      keepaUpdatedAt: "",
      keepa_lckd: "",
      keepaEanUpdatedAt: "",
      keepaEan_lckd: "",
      // scrape listing
      aznUpdatedAt: "",
      azn_taskId: "",
      // dealazn properties
      dealAznUpdatedAt: "",
      dealAznTaskId: "",
    },
  };
  keepaProperties.forEach((prop) => {
    query.$unset[prop.name] = "";
  });
  return query;
};

export const aznProjectFields = {
  a_pblsh: 1,
  a_nm: 1,
  a_useCurrPrice:1,
  a_cur: 1,
  a_rating: 1,
  a_reviewcnt: 1,
  bsr: 1,
  a_img: 1,
  a_avg_price:1,
  a_avg_fld: 1,
  dealAznUpdatedAt: 1,
  monthlySoldSource: 1,
  monthlySoldHistory: 1,
  lastSoldUpdate: 1,
  asin: 1,
  a_prc: 1,
  costs: 1,
  a_uprc: 1,
  a_qty: 1,
  a_orgn: 1,
  a_mrgn: 1,
  a_mrgn_pct: 1,
  a_w_mrgn: 1,
  a_w_mrgn_pct: 1,
  a_p_w_mrgn: 1,
  a_p_w_mrgn_pct: 1,
  a_p_mrgn: 1,
  a_vrfd: 1,
  a_p_mrgn_pct: 1,
  drops30: 1,
  drops90: 1,
  categories: 1,
  numberOfItems: 1,
  availabilityAmazon: 1,
  categoryTree: 1,
  salesRanks: 1, // Sales Rank nullable
  monthlySold: 1,
  ahstprcs: 1, // Amazon history prices
  anhstprcs: 1, // Amazon new history prices
  auhstprcs: 1, // Amazon used history prices
  curr_ahsprcs: 1,
  curr_ansprcs: 1,
  curr_ausprcs: 1,
  curr_salesRank: 1,
  avg30_ahsprcs: 1, // Average of the Amazon history prices of the last 90 days
  avg30_ansprcs: 1, // Average of the Amazon history prices of the last 90 days
  avg30_ausprcs: 1, // Average of the Amazon history prices of the last 90 days
  avg30_salesRank: 1, // Average of the Amazon history prices of the last 90 days
  avg90_ahsprcs: 1, // Average of the Amazon history prices of the last 90 days
  avg90_ansprcs: 1, // Average of the Amazon history prices of the last 90 days
  avg90_ausprcs: 1, // Average of the Amazon history prices of the last 90 days
  avg90_salesRank: 1, // Average of the Amazon history prices of the last 90 days
  buyBoxIsAmazon: 1,
  stockAmount: 1, //  The stock of the Amazon offer, if available. Otherwise undefined.
  stockBuyBox: 1, // he stock of the buy box offer, if available. Otherwise undefined.
  totalOfferCount: 1, // The total count of offers for this product (all conditions combined). The offer count per condition can be found in the current field.
};
