export interface BSR {
  category: string;
  number: number;
  createdAt: string;
}

export interface EbyCategory {
  category: string;
  id: number;
  createdAt?: string;
}

export type Product = {
  ean: string;
  _id: string;
  pblsh: boolean;
  bsr: BSR[];
  keepaUpdatedAt: string;
  s: string;
  primaryBsrExists: boolean;
  vrfd: boolean;
  ctgry: string[] | string;
  mnfctr: string;
  nm: string;
  asin: string;
  e_prc: number;
  a_prc: number;
  img: string;
  lnk: string;
  prc: number;
  createdAt: string;
  updatedAt: string;
  e_lnk: string;
  e_img: string;
  e_nm: string;
  e_mrgn: number;
  e_mrgn_pct: number;
  a_lnk: string;
  a_img: string;
  a_nm: string;
  a_mrgn: number;
  a_mrgn_pct: number;
};

export interface Verification {
  vrfd?: boolean;
  isMatch?: boolean;
  qty?: number;
  qty_score?: number;
  score?: number;
  vrfn_pending?: boolean;
  flags?: string[];
  flag_cnt?: number;
}

export interface ModifiedProduct extends Product {
  bsr_1: number;
  bsr_cat_1: string;
  e_pRange?: {
    min: number;
    max: number;
    median: number;
  };
  e_uprc: number;
  e_vrfd?: Verification;
  a_vrfd?: Verification;
  isBookmarked: boolean;
  a_uprc: number;
  esin: string;
  shop?: string;
  uprc: number;
  availUpdatedAt?: string;
  dealEbyUpdatedAt?: string;
  dealAznUpdatedAt?: string;
  ebyCategories: EbyCategory[];
  qty: number;
  e_qty: number;
  a_qty: number;
  bsr_2: number;
  tax: number;
  bsr_cat_2: string;
  bsr_3: number;
  bsr_cat_3: string;
  categories: number[];
  eanList: string[];
  brand: string;
  numberOfItems: number;
  availabilityAmazon: number;
  categoryTree: CategoryTree[];
  salesRanks: SalesRanks;
  monthlySold: any;
  ahstprcs: number[];
  anhstprcs: number[];
  auhstprcs: number[];
  curr_salesRank: number;
  curr_ahsprcs: number;
  curr_ansprcs: number;
  curr_ausprcs: number;
  avg90_ahsprcs: number;
  avg90_ansprcs: number;
  avg90_ausprcs: number;
  avg90_salesRank: number;
  buyBoxIsAmazon: boolean;
  stockAmount: any;
  costs: Costs;
  stockBuyBox: any;
  totalOfferCount: number;
}

export interface BookMarkProduct extends ModifiedProduct {
  shop: string;
}

export interface Costs {
  tpt: number;
  varc: number;
  azn: number;
  strg_1_hy: number;
  strg_2_hy: number;
}

export interface CategoryTree {
  catId: number;
  name: string;
}

export interface SalesRanks {
  [key: string]: number[];
}
