import { useMutation } from "@tanstack/react-query";

export function useProductSeen({
  target,
  domain,
}: {
  target: string;
  domain: string;
}) {
  return useMutation({
    mutationFn: async (productId: string) => {
      return fetch(
        `/app/api/shop/${domain}/${target}/product/${productId}/seen`
      );
    },
  });
}
