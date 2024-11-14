import { Settings } from "@/types/Settings";
import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";

export interface MarrginFields {
  target: string;
  settings: Settings;
}

export const marginFields = ({ target, settings }: MarrginFields) => {
  const { minMargin, minPercentageMargin, euProgram } = settings;
  return {
    $and: [
      { [`${target}_prc`]: { $gt: 0 } },
      { [mrgnFieldName(target, euProgram)]: { $gt: minMargin } },
      {
        [mrgnPctFieldName(target, euProgram)]: {
          $gt: minPercentageMargin,
        },
      },
    ],
  };
};
