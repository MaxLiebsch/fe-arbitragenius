import { useQuery } from "@tanstack/react-query";

export default function useProductCount(domain: string) {
  return useQuery<number>({
    queryKey: ["shop", domain, "product", "count"],
    queryFn: () =>
      fetch(`/api/shop/${domain}/product/count`).then((resp) => resp.json()),
  });
}