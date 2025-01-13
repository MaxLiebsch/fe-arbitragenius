import { Settings } from "@/types/Settings";
import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";
import { addAznSettingsFields } from "./addAznSettingsFields";
import { marginField, marginPctField } from "./marginFields";
import { marginAddField } from "./marginAddField";
import { marginPctAddField } from "./marginPctAddField";

export const aznFields = (
  settings: Settings,
  sdmn?: string,
  isWholesale?: boolean
): any[] => {
  const { a_tptStandard, a_strg, a_prepCenter, fba, euProgram } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];

  const match: any = {
    a_pblsh: true,
    ...marginField({ target: "a", settings }),
    ...(settings.minPercentageMargin > 0 &&
      marginPctField({ target: "a", settings })),
  };

  const isSommer = new Date().getMonth() < 9;
  if (settings.a_cats.length > 0 && settings.a_cats[0] !== 0) {
    match["categoryTree.catId"] = { $in: settings.a_cats };
  }

  if (sdmn) {
    match.sdmn = sdmn;
  }

  addAznSettingsFields(settings, match);

  const query: any = [];

  if (!isWholesale) {
    match["a_avg_fld"] = { $ne: null };
    query.push({
      $match: match,
    });
  }
  const computedPriceAddField = isWholesale
    ? {
        $addFields: {
          computedPrice: {
            $cond: {
              if: { $eq: ["$a_avg_fld", null] },
              then: {
                $cond: {
                  if: { $gt: ["$a_prc", 1] },
                  then: "$a_prc",
                  else: null,
                },
              },

              else: "$a_avg_price",
            },
          },
        },
      }
    : {
        $addFields: {
          computedPrice: "$a_avg_price",
        },
      };

  // If the user does not use Azn FBA, then the margin is calculated,
  // based on there settings for transport, storage, and preparation center
  const costs = fba
    ? [
        "$costs.tpt",
        "$costs.varc",
        isSommer ? "$costs.strg_1_hy" : "$costs.strg_2_hy",
        a_prepCenter,
        "$costs.azn",
      ]
    : [transport, a_strg, a_prepCenter, "$costs.azn"];

  query.push(computedPriceAddField, marginAddField({ euProgram, costs }));

  if (isWholesale) {
    query.push(marginPctAddField({ euProgram }));
  } else {
    query.push(
      {
        $match: {
          ...marginField({ target: "a", settings }),
        },
      },
      marginPctAddField({ euProgram })
    );
  }

  return query;
};
