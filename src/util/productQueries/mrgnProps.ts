export const mrgnFieldName = (target: string, euProgram: boolean) => {
  const isAzn = target === "a";
  const isEuProgram = isAzn ? (!euProgram ? "_p" : "") : "";
  const isSommer = new Date().getMonth() < 9;
  const winter = isAzn ? (isSommer ? "" : "_w") : "";
  return `${target}${isEuProgram}${winter}_mrgn`;
};

export const mrgnPctFieldName = (target: string, euProgram: boolean) => {
  const isAzn = target === "a";
  const isEuProgram = isAzn ? (!euProgram ? "_p" : "") : "";
  const isSommer = new Date().getMonth() < 9;
  const winter = isAzn ? (isSommer ? "" : "_w") : "";

  return `${target}${isEuProgram}${winter}_mrgn_pct`;
};
