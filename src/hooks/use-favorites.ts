import { useQuery } from "@tanstack/react-query";

export default function useFavorites() {
  return useQuery<string[]>({
    queryKey: ["preferences", "favorites"],
    queryFn: () =>
      fetch(`/api/user/preferences`)
        .then((resp) => resp.json())
        .then((preferences) => preferences.favorites?.split(",") ?? []),
  });
}
