import { Settings } from "@/types/Settings";

export interface MarrginFields {
  target: string;
  settings: Settings;
}

export const marginFields = ({ target, settings }: MarrginFields) => {
  const { minMargin, minPercentageMargin, euProgram } = settings;
  if (target === "a" && !euProgram) {
    return {
      $and: [
        { [`${target}_prc`]: { $gt: 0 } },
        { [`${target}_p_mrgn`]: { $gt: minMargin } },
        { [`${target}_p_mrgn_pct`]: { $gt: minPercentageMargin } },
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
