import { useQuery } from "@tanstack/react-query";

export default function usePreferences() {
  return useQuery<any>({
    queryKey: ["preferences"],
    queryFn: () => fetch(`/app/api/user/preferences`).then((resp) => resp.json()),
  });
}
