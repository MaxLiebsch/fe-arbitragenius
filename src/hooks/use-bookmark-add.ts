import { BookmarkSchema } from "@/types/Bookmarks";
import { ModifiedProduct } from "@/types/Product";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useBookMarkAdd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: { body: BookmarkSchema, page: number, pageSize: number }) => {
      const { body } = options;
      const response = await fetch(`/app/api/user/bookmarks`, {
        method: "POST",
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
        variables.pageSize
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
                isBookmarked: true,
              };
            }
            return product;
          }
        );
        queryClient.setQueryData(previousQueryData[0], products);
      }
    },
    onSettled: (data, error, variables, context) => {
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
      queryClient.invalidateQueries({queryKey:["bookmarks"]});
    },
    onError: (err, domain, context) => {
      console.log("err:", err);
    },
  });
}
