import { BookMarkReturn } from "@/types/Bookmarks";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useBookmarks(refetchOnWindowFocus: boolean = true) {
  const queryClient = useQueryClient();

  const productQuery = useQuery<BookMarkReturn>({
    queryKey: ["bookmarks"],
    refetchOnWindowFocus,
    queryFn: async () => {
      return fetch(`/app/api/user/bookmarks`).then((resp) => resp.json());
    },
  });

  return productQuery;
}
