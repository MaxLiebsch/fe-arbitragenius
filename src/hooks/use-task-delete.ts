
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteTask({ taskId }: { taskId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/app/api/tasks/${taskId}`,
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
