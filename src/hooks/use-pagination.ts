import { useEffect, useState } from "react";
import { ProductPagination} from "./use-products";

export const usePagination = () => {
  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: 20,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let page = Number(searchParams.get("page")) || 0;
    if(page  > 0){
      page = page - 1;
    }
    const pageSize = searchParams.get("pageSize") || 20;
    setPaginationModel({ page: +page, pageSize: +pageSize });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (paginationModel.page + 1).toString());
    searchParams.set("pageSize", paginationModel.pageSize.toString());
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  }, [paginationModel]);

  return [paginationModel, setPaginationModel] as const;
};
