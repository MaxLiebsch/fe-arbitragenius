import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useProductUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: {
      domain: string;
      productId: string;
      update: { [key: string]: any };
    }) => {
      const { domain, update, productId } = options;
      console.log('productId:', productId)
      console.log('update:', update)
      console.log('domain:', domain)
      const response = await fetch(`/app/api/shop/${domain}/product/${productId}`, {
        method: "POST",
        body: JSON.stringify(update),
      });

      if (!response.ok) throw new Error();
    },
    onError: (err, domain, context) => {
      console.log("err:", err);
    },
  });
}
