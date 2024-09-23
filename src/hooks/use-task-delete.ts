import { WholeSaleTarget } from "@/types/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteTask({
  taskId,
  target,
}: {
  taskId: string;
  target: WholeSaleTarget;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/app/api/tasks/${taskId}?target=${target}`,
        {
          method: "DELETE",
        }
      );

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
