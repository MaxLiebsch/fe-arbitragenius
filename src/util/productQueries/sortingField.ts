import { Settings } from "@/types/Settings";
import { mrgnPctFieldName } from "./mrgnProps";

type SortingField = {
  isAmazon: boolean;
  query: any;
  sort: any;
  settings: Settings;
  createdAt?: boolean;
  keepaUpdatedAt?: boolean;
};

export function sortingField({
  isAmazon,
  query,
  sort,
  createdAt,
  settings,
  keepaUpdatedAt,
}: SortingField) {
  const { euProgram, showSeen } = settings;

  if (showSeen) {
    sort["seen"] = -1;
  } else {
    sort["seen"] = 1;
  } 
  
  if (isAmazon) {
    if (query.field === "none") {
      if(createdAt){
        sort["createdAt"] = -1; // sort by createdAt in descending order
      }
      if(keepaUpdatedAt){
        sort["keepaUpdatedAt"] = -1; // sort by keepaUpdatedAt in descending order
      }
      sort["bsr.number"] = 1;
      sort[mrgnPctFieldName("a", euProgram)] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  } else {
    if (query.field === "none") {
      if(createdAt){
        sort["createdAt"] = -1; // sort by createdAt in descending order
      }
      sort[mrgnPctFieldName("e", false)] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  }
}
