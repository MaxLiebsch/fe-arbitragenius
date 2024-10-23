export const resetEbyProductQuery = () => {
  const query: { [key: string]: any } = {
    $unset: {
      //standard properties
      e_pblsh: "",
      e_nm: "",
      e_lnk: "",
      e_cur: "",
      e_img: "",
      esin: "",
      e_prc: "",
      e_uprc: "",
      e_qty: "",
      e_orgn: "",
      e_pRange: "",
      e_hash: "",
      e_mrgn: "",
      e_mrgn_pct: "",
      e_ns_costs: "",
      e_ns_mrgn: "",
      e_ns_mrgn_pct: "",
      e_tax: "",
      ebyCategories: "",
      e_vrfd: "",
      // query ean on eby
      eby_prop: "",
      // lookup category
      cat_prop: "",
      cat_taskId: "",
      // scrape listing
      ebyUpdatedAt: "",
      eby_taskId: "",
      // dealeby properties
      dealEbyUpdatedAt: "",
      dealEbyTaskId: "",
    },
  };
  return query;
};

export const ebyProjectFields = {
  e_pblsh: 1,
  e_nm: 1,
  e_lnk: 1,
  e_cur: 1,
  e_img: 1,
  esin: 1,
  dealEbyUpdatedAt: 1,
  e_prc: 1,
  e_uprc: 1,
  e_qty: 1,
  e_orgn: 1,
  e_pRange: 1,
  e_mrgn: 1,
  e_mrgn_pct: 1,
  e_ns_costs: 1,
  e_ns_mrgn: 1,
  e_ns_mrgn_pct: 1,
  e_tax: 1,
  ebyCategories: 1,
  e_vrfd: 1,
};
