import { Settings } from "@/types/Settings";

export const salesQueryKey = (
  target: string,
  page: number,
  pageSize: number
) => {
  return [target, "shop", "sales", "product", "get", page, pageSize];
};

export const aznFlipsQueryKey = (page: number, pageSize: number) => {
  return ["a", "shop", "flips", "shop", "product", "get", page, pageSize];
};

export const productQueryKey = (
  target: string,
  shop: string,
  page: number,
  pageSize: number
) => {
  return [target, "shop", shop, "product", "get", page, pageSize];
};

export const countQueryKey = (target: string, shop: string, settings?: Settings) => {
  const settingsKeys = settings ? Object.values(settings) : [];
  return [target, "shop", shop, "product", "count", ...settingsKeys];
};
