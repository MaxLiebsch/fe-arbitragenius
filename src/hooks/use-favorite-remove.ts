import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFavorites from "./use-favorites";
import { Shop } from "./use-shop";

export default function useFavoriteRemove() {
  const queryClient = useQueryClient();
  const favoritesQuery = useFavorites();

  return useMutation({
    mutationFn: async (domain: string) => {
      if (!favoritesQuery.isSuccess || !favoritesQuery.data.includes(domain))
        throw new Error();

      const response = await fetch(`/api/user/preferences/favorites`, {
        method: "POST",
        body: JSON.stringify(
          favoritesQuery.data.filter((elem) => elem !== domain)
        ),
      });

      if (!response.ok) throw new Error();
    },
    onMutate: async (domain: string) => {
      await queryClient.cancelQueries({
        queryKey: ["preferences", "favorites"],
      });
      await queryClient.cancelQueries({
        queryKey: ["shop", "favorites"],
      });
      const previousFavorites = queryClient.getQueryData([
        "preferences",
        "favorites",
      ]);
      const previousShops = queryClient.getQueryData([["shop", "favorites"]]);
      queryClient.setQueryData(["preferences", "favorites"], (old: string[]) =>
        old.filter((elem) => elem !== domain)
      );
      queryClient.setQueryData(
        ["shop", "favorites"],
        (old: Pick<Shop, "d" | "ne">[]) =>
          old.filter((elem) => elem.d !== domain)
      );
      return { previousFavorites, previousShops };
    },
    onError: (err, domain, context) => {
      queryClient.setQueryData(
        ["preferences", "favorites"],
        context?.previousFavorites
      );
      queryClient.setQueryData(["shop", "favorites"], context?.previousShops);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences", "favorites"] });
      queryClient.invalidateQueries({ queryKey: ["shop", "favorites"] });
    },
  });
}
