import { useQuery } from "@tanstack/react-query";

export default function usePreferences(key: string) {
  return useQuery<any>({
    queryKey: ["preferences"],
    queryFn: () =>
      fetch(`/app/api/user/preferences/${key}`).then((resp) => resp.json()),
  });
}
