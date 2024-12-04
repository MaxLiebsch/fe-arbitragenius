import { Appearance } from "@/types/Appearance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useAppereanceAdd() {
  const queryClient = useQueryClient();
  const key = 'appearance';
  return useMutation({
    mutationFn: (value: Appearance) => {
      return fetch(`/app/api/user/preferences/${key}`, {
        method: "POST",
        body: JSON.stringify(value),
      });
    },
    onMutate(variables) {
      const previousQuery = queryClient.getQueriesData({
        queryKey: ["preferences", key],
        exact: false,
      });
      if (previousQuery.length) {
        queryClient.setQueryData(["preferences", key], variables);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["preferences", key],
      });
    },
  });
}
