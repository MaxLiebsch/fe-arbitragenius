import { BookmarkSchema, Variables } from "@/types/Bookmarks";
import { ModifiedProduct } from "@/types/Product";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


const invalidateProductQueries = async (
  variables: Variables,
  queryClient: QueryClient
) => {
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
            isBookmarked: true,
          };
        }
        return product;
      }
    );
    queryClient.setQueryData(previousQueryData[0], products);
  }
};

const invalidateSalesQueries = async (
  variables: Variables,
  queryClient: QueryClient
) => {
  const queryKey = [
    variables.body.target,
    "sales",
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
            isBookmarked: true,
          };
        }
        return product;
      }
    );
    queryClient.setQueryData(previousQueryData[0], products);
  }
};

export const invalidateProductQueriesOnSettled = async (
  variables: Variables,
  queryClient: QueryClient
) => {
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
  queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
};

export const invalidateSalesQueriesOnSettled = async (
  variables: Variables,
  queryClient: QueryClient
) => {
  const queryKey = [variables.body.target, "sales", "get"];
  queryClient.invalidateQueries({
    queryKey,
    exact: false,
  });
  queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
};

export default function useBookMarkAdd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: {
      body: BookmarkSchema;
      page: number;
      pageSize: number;
    }) => {
      const { body } = options;
      const response = await fetch(`/app/api/user/bookmarks`, {
        method: "POST",
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
