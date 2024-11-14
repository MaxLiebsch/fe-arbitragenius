import { useQuery } from "@tanstack/react-query";

export type Shop = {
  active: boolean;
  d: string;
  total?: number;
  a_fat_total?: number;
  e_fat_total?: number;
  ne: string;
  e_cats: { [key: string]: number };
  a_cats: { [key: string]: number };
};

export default function useShop(domain: string) {
  return useQuery<Shop>({
    queryKey: ["shop", domain],
    queryFn: () => fetch(`/app/api/shop/${domain}`).then((resp) => resp.json()),
  });
}
