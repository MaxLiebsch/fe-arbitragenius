import { countQueryKey, productQueryKey } from "@/util/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductPagination } from "./use-aznflips-products";
import { useUserSettings } from "./use-settings";

export function useProductIrrelevant({
  target,
  domain,
  pagination,
}: {
  target: string;
  domain: string;
  pagination: ProductPagination;
}) {
  const queryClient = useQueryClient();
  const [settings, setUserSettings] = useUserSettings();
  return useMutation({
    mutationFn: async ({ productId }: { productId: string }) => {
      return fetch(
        `/app/api/shop/${domain}/${target}/product/${productId}/not-relevant`
      );
    },
    onSettled(data, error, variables, context) {
      const { page, pageSize } = pagination;
      const queryKey = productQueryKey(target, domain, page, pageSize);
      queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
      const query = countQueryKey(target, "sales", settings);
      queryClient.invalidateQueries({
        queryKey: query,
      });
    },
  });
}
