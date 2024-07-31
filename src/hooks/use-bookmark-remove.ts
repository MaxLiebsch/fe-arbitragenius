import {
  BookmarkByTarget,
  BookmarkDeleteSchema,
  BookMarkReturn,
  BookmarkSchema,
} from "@/types/Bookmarks";
import { ModifiedProduct } from "@/types/Product";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useBookMarkRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: {
      body: BookmarkDeleteSchema;
      page: number;
      pageSize: number;
    }) => {
      const { body, page, pageSize } = options;
      const response = await fetch(`/app/api/user/bookmarks`, {
        method: "DELETE",
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(await response.text());
    },
    onMutate: async (variables) => {
      const queryKey = [
        variables.body.target,
        "shop",
        variables.body.shop,
        "product",
        "get",
        variables.page,
        variables.pageSize,
      ];
      await queryClient.cancelQueries({ queryKey, exact: false });
      const previousQuery = queryClient.getQueriesData({
        queryKey,
        exact: false,
      });
      if (previousQuery.length) {
        const previousQueryData = previousQuery[0];
        const products = (previousQueryData[1] as ModifiedProduct[]).map(
          (product) => {
            if (product._id === variables.body.productId) {
              return {
                ...product,
                isBookmarked: false,
              };
            }
            return product;
          }
        );
        queryClient.setQueryData(previousQueryData[0], products);
      }
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = queryClient.getQueryData([
        "bookmarks",
      ]) as BookMarkReturn;
      
      if (previousBookmarks) {
        const bookmarks = {
          ...previousBookmarks,
          [variables.body.target]: previousBookmarks[
            variables.body.target as "e" | "a"
          ].filter((product) => {
            if (product._id !== variables.body.productId) {
              return product;
            }
          }),
        };
        queryClient.setQueryData(["bookmarks"], bookmarks);
      }
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      const queryKey = [
        variables.body.target,
        "shop",
        variables.body.shop,
        "product",
        "get",
      ];
      queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
    },
    onError: (err, domain, context) => {
      console.log("err:", err);
    },
  });
}
