import {
  BookmarkByTarget,
  BookmarkDeleteSchema,
  BookMarkReturn,
  BookmarkSchema,
  Variables,
} from "@/types/Bookmarks";
import { ModifiedProduct } from "@/types/Product";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  invalidateProductQueriesOnSettled,
  invalidateSalesQueriesOnSettled,
} from "./use-bookmark-add";
import { productQueryKey, salesQueryKey } from "@/util/queryKeys";

const invalidateProductQueries = async (
  variables: Variables,
  queryClient: QueryClient
) => {
  const { body, page, pageSize } = variables;
  const { target, shop } = body;
  const queryKey = productQueryKey(target, shop, page, pageSize);
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
};

const invalidateSalesQueries = async (
  variables: Variables,
  queryClient: QueryClient
) => {
  const queryKey = salesQueryKey(
    variables.body.target,
    variables.page,
    variables.pageSize
  );
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
};

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
      if (variables.body.shop === "sales") {
        await invalidateSalesQueries(variables, queryClient);
      } else {
        await invalidateProductQueries(variables, queryClient);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (variables.body.shop === "sales") {
        invalidateSalesQueriesOnSettled(variables, queryClient);
      } else {
        invalidateProductQueriesOnSettled(variables, queryClient);
      }
    },
    onError: (err, domain, context) => {
      console.log("err:", err);
    },
  });
}
