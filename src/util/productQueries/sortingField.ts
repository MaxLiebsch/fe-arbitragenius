import { Settings } from "@/types/Settings";
import { mrgnPctFieldName } from "./mrgnProps";
import { create } from "domain";

type SortingField = {
  isAmazon: boolean;
  query: any;
  sort: any;
  settings: Settings;
  createdAt?: boolean;
};

export function sortingField({
  isAmazon,
  query,
  sort,
  createdAt,
  settings,
}: SortingField) {
  const { euProgram, showSeen } = settings;

  if (showSeen) {
    sort["seen"] = -1;
  } else {
    sort["seen"] = 1;
  }

  if(createdAt){
    sort["createdAt"] = -1; // sort by createdAt in descending order
  }


  if (isAmazon) {
    if (query.field === "none") {
      sort["bsr.number"] = 1;
      sort[mrgnPctFieldName("a", euProgram)] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  } else {
    if (query.field === "none") {
      sort[mrgnPctFieldName("e", false)] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  }
}
