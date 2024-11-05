export const aznMrgnFieldName = (euProgram: boolean) => {
  const isEuProgram = !euProgram ? "_p" : "";
  const isSommer = new Date().getMonth() < 9;
  const winter = isSommer ? "" : "_w";

  return `a${isEuProgram}${winter}_mrgn`;
};

export const aznMrgnPctFieldName = (euProgram: boolean) => {
  const isEuProgram = !euProgram ? "_p" : "";
  const isSommer = new Date().getMonth() < 9;
  const winter = isSommer ? "" : "_w";

  return `a${isEuProgram}${winter}_mrgn_pct`;
};
