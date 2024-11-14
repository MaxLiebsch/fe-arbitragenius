import { DbTask, Task } from "@/types/tasks";
import { useQuery } from "@tanstack/react-query";

export default function useTask({ taskId }: { taskId: string }) {
  return useQuery<DbTask[]>({
    queryKey: ["tasks", taskId],
    queryFn: () =>
      fetch(`/app/api/tasks/${taskId}`).then((resp) => resp.json()),
  });
}
