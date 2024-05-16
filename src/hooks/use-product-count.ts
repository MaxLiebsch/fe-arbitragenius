import { Settings } from "@/types/Settings";
import { useQuery } from "@tanstack/react-query";

export default function useProductCount(domain: string, target: string, settings:Settings) {
  return useQuery<{productCount: number}>({
    queryKey: ["shop", domain, target, "product", "count"],
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      fetch(`/app/api/shop/${domain}/${target}/product/count?productsWithNoBsr=${settings.productsWithNoBsr}&maxSecondaryBsr=${settings.maxSecondaryBsr}&maxPrimaryBsr=${settings.maxPrimaryBsr}&minMargin=${settings.minMargin}&minPercentageMargin=${settings.minPercentageMargin}`).then((resp) =>
        resp.json()
      ),
  });
}
