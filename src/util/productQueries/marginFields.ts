import { Settings } from "@/types/Settings";
import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";

export interface MarrginFields {
  target: string;
  settings: Settings;
}

export const marginFieldForWholesale = ({ target, settings }: MarrginFields) => {
  const { euProgram } = settings;
  return {
    [mrgnFieldName(target, euProgram)]: { $gte: -1000 },
  };
}

export const marginField = ({ target, settings }: MarrginFields) => {
  const { minMargin, euProgram } = settings;
  if (minMargin === 0) {
    return {
      [mrgnFieldName(target, euProgram)]: { $gt: minMargin },
    };
  }
  return {
    [mrgnFieldName(target, euProgram)]: { $gte: minMargin },
  };
};

export const marginPctField = ({ target, settings }: MarrginFields) => {
  const { minPercentageMargin, euProgram } = settings;
  if (minPercentageMargin === 0) {
    return {
      [mrgnPctFieldName(target, euProgram)]: { $gt: minPercentageMargin },
    };
  }
  return {
    [mrgnPctFieldName(target, euProgram)]: { $gte: minPercentageMargin },
  };
};
