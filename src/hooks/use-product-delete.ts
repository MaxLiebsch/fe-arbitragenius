import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useProductDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: {
      domain: string;
      productId: string;
    }) => {
      const { domain, productId } = options;
      const response = await fetch(`/app/api/shop/${domain}/product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["shop"] });
    // },
    onError: (err, domain, context) => {
      console.log("err:", err);
    },
  });
}
