import { Settings } from "@/types/Settings";
import { useQuery } from "@tanstack/react-query";

export default function useProductCount(domain: string, target: string, settings:Settings) {
  return useQuery<number>({
    queryKey: ["shop", domain, target, "product", "count"],
    queryFn: () =>
      fetch(`/app/api/shop/${domain}/${target}/product/count?minMargin=${settings.minMargin}&minPercentageMargin=${settings.minPercentageMargin}`).then((resp) =>
        resp.json()
      ),
  });
}
