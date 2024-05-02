import { useQuery } from "@tanstack/react-query";

export default function useProductCount(domain: string, target: string) {
  return useQuery<number>({
    queryKey: ["shop", domain, target, "product", "count"],
    queryFn: () =>
      fetch(`/app/api/shop/${domain}/${target}/product/count`).then((resp) =>
        resp.json()
      ),
  });
}
