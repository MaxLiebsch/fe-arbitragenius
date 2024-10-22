import { keepaProperties } from "./keepaProperties";

export const resetAznProductQuery = () => {
  let query: { [key: string]: any } = {
    $unset: {
      //standard properties
      a_pblsh: "",
      a_nm: "",
      a_cur: "",
      a_lnk: "",
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
