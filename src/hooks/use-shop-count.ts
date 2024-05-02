import { useQuery } from "@tanstack/react-query";

export default function useShopCount() {
  return useQuery<number>({
    queryKey: ["shop", "count"],
    queryFn: () => fetch("/app/api/shop/count").then((resp) => resp.json()),
  });
}
