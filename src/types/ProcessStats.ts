export interface IProcessStats {
  name: string;
  distinctProducts: number;
  last24hStats: Last24hStats;
  lookupCategory: LookupCategory;
  lookupInfo: LookupInfo;
  queryEansOnEby: QueryEansOnEby;
  scrapeEan: ScrapeEan;
  updatedAt: string;
}

export interface Last24hStats {
  lookupInfo: number;
  lookupCategory: number;
  qtyBatch: number;
  nmBatch: number;
  queryEansOnEby: number;
  scrapeEan: number;
  dealOnEby: number;
  negDealOnEby: number;
  dealOnAzn: number;
  negDealOnAzn: number;
  keepa: number;
  keepaEan: number;
  products: number;
}

export interface LookupCategory {
  complete: number;
  categories_missing: number;
  missing: number;
  ean_missing: number;
  category_not_found: number;
  ean_missmatch: number;
  null: number;
  timeout: number;
}

export interface LookupInfo {
  missing: number;
  no_bsr: number;
  null: number;
  not_found: number;
  complete: number;
  incomplete: number;
}

export interface QueryEansOnEby {
  missing: number;
  complete: number;
  null: number;
}

export interface ScrapeEan {
  timeout: number;
  missing: number;
  found: number;
  null: number;
  invalid: number;
}
