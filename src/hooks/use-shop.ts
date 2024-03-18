import { useQuery } from "@tanstack/react-query";

export type Shop = {
  active: boolean;
  d: string;
  ne: string;
};

export default function useShop(domain: string) {
  return useQuery<Shop>({
    queryKey: ["shop", domain],
    queryFn: () => fetch(`/api/shop/${domain}`).then((resp) => resp.json()),
  });
}
