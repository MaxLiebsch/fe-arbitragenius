import { ProductRow } from "@/types/wholesaleProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: { body: ProductRow[] }) => {
      const { body } = options;
      const response = await fetch(`/app/api/tasks`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(await response.text());
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err, domain, context) => {
      console.log("err:", err);
    },
  });
}
