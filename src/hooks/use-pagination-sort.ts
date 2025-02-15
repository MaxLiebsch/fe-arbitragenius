import { sortAtom } from "@/atoms/sortAtom";
import { useAtom } from "jotai";
import { paginationAtom } from "@/atoms/paginationAtom";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { currentPathAtom } from "@/atoms/currentPathAtom";
import { ProductPagination } from "./use-products";
import { GridSortItem } from "@mui/x-data-grid-premium";

export const usePaginationAndSort = () => {
  const [paginationModel, setPaginationModel] = useAtom(paginationAtom);
  const [sortModel, setSortModel] = useAtom(sortAtom);
  const [currentPath, setCurrentPath] = useAtom(currentPathAtom);
  const pathname = usePathname();

  const handleSetSortModel = (sortModel: GridSortItem) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("sortby", sortModel.field);
    searchParams.set("sortorder", sortModel.sort || 'asc');
    setSortModel(sortModel);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  };
  const handleSetPaginationModel = (paginationModel: ProductPagination) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (paginationModel.page + 1).toString());
    searchParams.set("pageSize", paginationModel.pageSize.toString());
    setPaginationModel(paginationModel);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let page = Number(searchParams.get("page")) || 0;
    let sortBy = searchParams.get("sortby") || "none";
    let sortOrder = (searchParams.get("sortorder") as "asc" | "desc") || "desc";
    const pageSize = searchParams.get("pageSize") || 20;
    if (page > 0) {
      page = page - 1;
    }
    setPaginationModel({ page: +page, pageSize: +pageSize });
    setSortModel({ field: sortBy, sort: sortOrder });
  }, [setPaginationModel, setSortModel]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (paginationModel.page > 0) {
      searchParams.set("page", (paginationModel.page + 1).toString());
    }
    if (!searchParams.has("page")) {
      searchParams.set("page", (paginationModel.page + 1).toString());
    }
    if (paginationModel.pageSize > 20) {
      searchParams.set("pageSize", paginationModel.pageSize.toString());
    }
    if (!searchParams.has("pageSize")) {
      searchParams.set("pageSize", paginationModel.pageSize.toString());
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  }, [paginationModel]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (sortModel) {
      searchParams.set("sortby", sortModel.field);
      searchParams.set("sortorder", sortModel.sort || 'asc');
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  }, [sortModel]);

  useEffect(() => {
    if (pathname !== currentPath) {
      const searchParams = new URLSearchParams(window.location.search);
      setPaginationModel({ page: 0, pageSize: 20 });
      setSortModel({ field: "none", sort: "desc" });
      setCurrentPath(pathname);
      searchParams.set("page", (1).toString());
      searchParams.set("pageSize", (20).toString());
      searchParams.set("sortby", "none");
      searchParams.set("sortorder", "desc");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${searchParams}`
      );
    }
  }, [
    pathname,
    currentPath,
    setPaginationModel,
    setSortModel,
    setCurrentPath,
    paginationModel,
    sortModel,
  ]);
  return {
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    handleSetSortModel,
    handleSetPaginationModel,
   } as const;
};
