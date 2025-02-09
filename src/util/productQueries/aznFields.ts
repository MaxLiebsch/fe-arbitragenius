import { Settings } from "@/types/Settings";
import { addAznSettingsFields } from "./addAznSettingsFields";
import { marginField, marginPctField } from "./marginFields";
import { marginAddField } from "./marginAddField";
import { marginPctAddField } from "./marginPctAddField";
import { ISOStringWeek } from "@/types/Week";

type AznFields = {
  settings: Settings;
  sdmn?: string;
  isWholesale?: boolean;
  week?: ISOStringWeek;
  excludeShops?: string[];
};

export const aznFields = ({
  settings,
  sdmn,
  week,
  isWholesale,
  excludeShops,
}: AznFields): any[] => {
  const { a_tptStandard, a_strg, a_prepCenter, fba, euProgram } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];

  const match: any = {
    a_pblsh: true,
    ...marginField({ target: "a", settings }),
    ...(settings.minPercentageMargin > 0 &&
      marginPctField({ target: "a", settings })),
  };

  const wholeSaleMatch: any = {
    a_pblsh: true,
    ...(settings.minMargin > 0 && marginField({ target: "a", settings })),
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

  if (excludeShops && excludeShops.length > 0) {
    match["sdmn"] = { $nin: excludeShops };
  }

  if (week) {
    match["createdAt"] = { $gte: week.start, $lte: week.end };
  }

  const query: any = [];

  if (isWholesale) {
    addAznSettingsFields(settings, wholeSaleMatch);
    query.push({
      $match: wholeSaleMatch,
    });
  } else {
    addAznSettingsFields(settings, match);
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
