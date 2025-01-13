import { useMutation, useQuery } from "@tanstack/react-query";

export default function useLastAcknowledgedReleaseUpdate() {
  return useMutation({
    mutationFn: async (version: string) => {
      const response = await fetch(
        `/app/api/user/preferences/lastAcknowledgedRelease`,
        {
          method: "POST",
          body: JSON.stringify({version}),
        }
      );

      if (!response.ok) throw new Error();
    },
  });
}
