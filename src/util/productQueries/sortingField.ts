export function sortingField(
  isAmazon: boolean,
  query: any,
  sort: any,
  euProgram: boolean
) {
  const isEuProgram = !euProgram ? "_p" : "";
  const isSommer = new Date().getMonth() < 9;
  const winter = isSommer ? "" : "_w";
  if (isAmazon) {
    if (query.field === "none") {
      sort["primaryBsrExists"] = -1;
      sort["primaryBsr.number"] = 1;
      sort["secondaryBsr.number"] = 1;
      sort["thirdBsr.number"] = 1;
      sort[`a${isEuProgram}${winter}_mrgn_pct`] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  } else {
    if (query.field === "none") {
      sort["e_mrgn_pct"] = -1;
    } else if (query.field) {
      sort[query.field] = query.order === "asc" ? 1 : -1;
    }
  }
}
