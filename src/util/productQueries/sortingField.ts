import { Settings } from "@/types/Settings";
import { mrgnPctFieldName } from "./mrgnProps";

export function sortingField(
  isAmazon: boolean,
  query: any,
  sort: any,
  settings: Settings
) {
  const { euProgram, showSeen } = settings;

  if (showSeen) {
    sort["seen"] = -1;
  }else{
    sort["seen"] = 1;
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
  console.log("sort:", sort);
}
