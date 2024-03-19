import { useQuery } from "@tanstack/react-query";

export default function useFavorites() {
  return useQuery<string[]>({
    queryKey: ["preferences", "favorites"],
    queryFn: () =>
      fetch(`/api/user/preferences/favorites`).then((resp) => resp.json()),
  });
}
