export type Product = {
  ean: string;
  _id: string;
  pblsh: boolean;
  bsr: [];
  primaryBsrExists: boolean;
  vrfd: boolean;
  ctgry: string;
  mnfctr: string;
  nm: string;
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
  e_fat: boolean;
  e_mrgn_pct: number;
  a_lnk: string;
  a_img: string;
  a_nm: string;
  a_mrgn: number;
  a_fat: boolean;
  a_mrgn_pct: number;
};

export interface ModifiedProduct extends Product {
  bsr_1: number;
  bsr_cat_1: string;
  bsr_2: number;
  bsr_cat_2: string;
  bsr_3: number;
  bsr_cat_3: string;
}
