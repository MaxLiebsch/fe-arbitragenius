import { useEffect, useState } from "react";
import { ProductPagination, ProductSort } from "./use-products";

export const usePaginationAndSort = () => {
  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: 20,
  });
  const [sortModel, setSortModel] = useState<ProductSort>({
    field: `none`,
    direction: "desc",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let page = Number(searchParams.get("page")) || 0;
    if (page > 0) {
      page = page - 1;
    }
    const pageSize = searchParams.get("pageSize") || 20;
    setPaginationModel({ page: +page, pageSize: +pageSize });
    let sortBy = searchParams.get("sortby") || "none";
    let sortOrder = (searchParams.get("sortorder") as "asc" | "desc") || "desc";
    setSortModel({ field: sortBy, direction: sortOrder });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (paginationModel.page + 1).toString());
    searchParams.set("pageSize", paginationModel.pageSize.toString());
    if(sortModel){
      searchParams.set("sortby", sortModel.field);
      searchParams.set("sortorder", sortModel.direction);
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  }, [paginationModel, sortModel]);

  return [
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
  ] as const;
};
