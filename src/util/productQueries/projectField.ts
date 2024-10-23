import { aznProjectFields } from "../aznQueries";
import { ebyProjectFields } from "../ebyQueries";
import { commonProjectFields } from "./commonProject";

export function projectField(target: string) {
  let project = {
    ...commonProjectFields,
  };

  if (target === "a") {
    project = {
      ...project,
      ...aznProjectFields,
    };
  } else {
    project = {
      ...project,
      ...ebyProjectFields,
    };
  }

  return {
    $project: project,
  };
}
