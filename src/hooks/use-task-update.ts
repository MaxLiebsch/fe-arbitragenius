import { UpdateTaskBody } from "@/app/api/tasks/[id]/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
        taskId,
        body,
      }: {
        taskId: string;
        body: UpdateTaskBody;
      }) => {
      const response = await fetch(`/app/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
