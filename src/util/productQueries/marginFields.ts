import { Settings } from "@/types/Settings";
import { aznMrgnFieldName, aznMrgnPctFieldName } from "./mrgnProps";

export interface MarrginFields {
  target: string;
  settings: Settings;
}

export const marginFields = ({ target, settings }: MarrginFields) => {
  const { minMargin, minPercentageMargin, euProgram } = settings;
  if (target === "a") {
    return {
      $and: [
        { [`${target}_prc`]: { $gt: 0 } },
        { [aznMrgnFieldName(euProgram)]: { $gt: minMargin } },
        {
          [aznMrgnPctFieldName(euProgram)]: {
            $gt: minPercentageMargin,
          },
        },
      ],
    };
  } else if (target === "e") {
    return {
      $and: [
        { [`${target}_prc`]: { $gt: 0 } },
        { [`${target}_mrgn`]: { $gt: minMargin } },
        { [`${target}_mrgn_pct`]: { $gt: minPercentageMargin } },
      ],
    };
  }
};
