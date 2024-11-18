import { Settings } from "@/types/Settings";
import { mrgnFieldName } from "./mrgnProps";

export interface MarrginFields {
  target: string;
  settings: Settings;
}

export const marginFields = ({ target, settings }: MarrginFields) => {
  const { minMargin, euProgram } = settings;
  return {
    [mrgnFieldName(target, euProgram)]: { $gt: minMargin },
  };
};
