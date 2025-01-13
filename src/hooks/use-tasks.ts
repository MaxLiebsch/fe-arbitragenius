import { DbTask, Task } from "@/types/tasks";
import { useQuery } from "@tanstack/react-query";



export default function useTasks() {
  return useQuery<DbTask[]>({
    queryKey: ['tasks'],
    refetchOnWindowFocus: true,
    refetchInterval: 60000 * 2,
    queryFn: () =>
      fetch(`/app/api/tasks`).then((resp) => resp.json()),
  });
}
