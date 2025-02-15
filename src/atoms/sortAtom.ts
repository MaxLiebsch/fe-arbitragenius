import { GridSortItem } from "@mui/x-data-grid-premium";
import { atom } from "jotai";

export const sortAtom = atom({
  field: `none`,
  sort: "asc",
} as GridSortItem);
