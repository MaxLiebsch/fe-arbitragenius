import { useQuery } from "@tanstack/react-query";

export default function usePreferences(key: string) {
  return useQuery<any>({
    queryKey: ["preferences", key],
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
    queryFn: () =>
      fetch(`/app/api/user/preferences/${key}`).then((resp) => resp.json()),
  });
}
