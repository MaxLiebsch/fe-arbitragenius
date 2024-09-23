import { MutateTaskRequest } from "@/types/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createTaskRequest: MutateTaskRequest) => {
      const response = await fetch(`/app/api/tasks`, {
        method: "POST",
        body: JSON.stringify(createTaskRequest),
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
