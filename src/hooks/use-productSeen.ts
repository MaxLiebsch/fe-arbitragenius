import { countQueryKey, salesQueryKey } from "@/util/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserSettings } from "./use-settings";

export function useProductSeen({
  target,
  domain,
}: {
  target: string;
  domain: string;
}) {
  const queryClient = useQueryClient();
  const [settings, setUserSettings] = useUserSettings();
  return useMutation({
    mutationFn: async (productId: string) => {
      return fetch(
        `/app/api/shop/${domain}/${target}/product/${productId}/seen`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: countQueryKey(target, "sales", settings),
      });
    },
  });
}
