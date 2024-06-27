export interface WholeSaleProduct {
  ean: string;
  name: string;
  price: number;
  category: string;
  taskId: string;
  reference: string;
  clrName: string;
  locked: boolean;
  lookup_pending: boolean;
  shop: string;
  status: string;
  createdAt: string;
}

export interface ProcessedProduct extends WholeSaleProduct {
  a_img?: any;
  a_lnk?: string;
  a_mrgn?: number;
  a_mrgn_pct?: number;
  a_nm?: string;
  a_prc?: number;
}

export type ProductRow = Pick<
  ProcessedProduct,
  "ean" | "name" | "price" | "category" | "a_lnk" | "a_nm"
> & { id: number, reference?: string };
