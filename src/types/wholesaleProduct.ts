import { Costs } from "./Product";
import { WholeSaleTarget } from "./tasks";

export interface WholeSaleProduct {
  ean: string;
  eanList: string[];
  nm: string;
  lnk: string;
  prc: number;
  qty?: number;
  target: WholeSaleTarget[];
  sdmn: string;
  category: string;
  taskIds: string[];
  reference: string;
  clrName: string[];
  s_hash?: string;
  a_locked?: boolean;
  a_lookup_pending?: boolean;
  a_status?: string;
  e_locked?: boolean;
  e_lookup_pending?: boolean;
  e_status?: string;
  shop: string;
  createdAt: string;
}

export interface ProcessedProduct extends WholeSaleProduct {
  a_img?: any;
  a_lnk?: string;
  a_mrgn?: number;
  a_mrgn_pct?: number;
  a_nm?: string;
  a_prc?: number;
  e_img?: any;
  e_lnk?: string;
  e_mrgn?: number;
  e_mrgn_pct?: number;
  e_nm?: string;
  e_prc?: number;
  e_totalOfferCount?: number;
  buyBoxIsAmazon?: boolean;
  bsr?: number;
  totalOfferCount?: number;
  costs?: Costs;
}

export type ProductRow = Pick<
  ProcessedProduct,
  "ean" | "nm" | "prc" | "category" | "a_lnk" | "a_nm"
> & { id: number; reference?: string };
