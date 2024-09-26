import { useQuery } from "@tanstack/react-query";

export default function useTaskProductCount(taskId?: string) {
  return useQuery<number>({
    queryKey: ["task", "product", "count", taskId],
    enabled: !!taskId,
    queryFn: () =>
      fetch(`/app/api/tasks/${taskId}/product/count`).then((resp) =>
        resp.json()
      ),
  });
}
