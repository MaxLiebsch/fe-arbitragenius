import { Settings } from "@/types/Settings";

export interface MarrginFields {
  target: string;
  settings: Settings;
}

export const marginFields = ({ target, settings }: MarrginFields) => {
  const { minMargin, minPercentageMargin, euProgram } = settings;
  const sommer = new Date().getMonth()  < 8 ? "" : "_w";
  if (target === "a" && !euProgram) {
    return {
      $and: [
        { [`${target}_prc`]: { $gt: 0 } },
        { [`${target}_p${sommer}_mrgn`]: { $gt: minMargin } },
        { [`${target}_p${sommer}_mrgn_pct`]: { $gt: minPercentageMargin } },
      ],
    };
  } else {
    return {
      $and: [
        { [`${target}_prc`]: { $gt: 0 } },
        { [`${target}_mrgn`]: { $gt: minMargin } },
        { [`${target}_mrgn_pct`]: { $gt: minPercentageMargin } },
      ],
    };
  }
};
