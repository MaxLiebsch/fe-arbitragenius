import { useQuery } from "@tanstack/react-query";

export default function useRelease({ enabled }: { enabled: boolean }) {
  return useQuery<any>({
    queryKey: ["releases", process.env.NEXT_PUBLIC_VERSION],
    enabled,
    retry: false,
    queryFn: () => fetch(`/app/api/releases`).then((resp) => resp.json()),
  });
}
