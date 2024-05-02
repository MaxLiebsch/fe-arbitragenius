import { useQuery } from "@tanstack/react-query";
import { Shop } from "./use-shop";

export default function useFavoriteShops() {
  return useQuery<Pick<Shop, "d" | "ne">[]>({
    queryKey: ["shop", "favorites"],
    queryFn: () => fetch("/app/api/shop/favorites").then((resp) => resp.json()),
  });
}
