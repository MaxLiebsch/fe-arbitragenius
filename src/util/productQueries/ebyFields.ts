import { Settings } from "@/types/Settings";
import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";
import { marginField, marginPctField } from "./marginFields";
import { addTotalOffersCountField } from "./totalOffersCountField";
import { ISOStringWeek } from "@/types/Week";

type EbyFields = {
  settings: Settings;
  sdmn?: string;
  isWholeSale?: boolean;
  week?: ISOStringWeek;
  excludeShops?: string[];
};

export const ebyFields = ({ settings, sdmn, isWholeSale, week, excludeShops }: EbyFields) => {
  const { tptStandard, strg, e_prepCenter, e_cats } = settings;
  const transport = settings[tptStandard as "tptSmall"];
  const match: any = {
    e_pblsh: true,
    ...marginField({ target: "e", settings }),
    ...(settings.minPercentageMargin > 0 &&
      marginPctField({ target: "e", settings })),
    e_pRange: { $exists: true },
  };

  addTotalOffersCountField(match, settings.totalOfferCount, "e");

  if (sdmn) {
    match.sdmn = sdmn;
  }

  if (excludeShops && excludeShops.length > 0) {
    match["sdmn"] = { $nin: excludeShops };
  }

  if (week) {
    match["createdAt"] = { $gte: week.start, $lte: week.end };
  }

  if (e_cats.length > 0 && e_cats[0] !== 0) {
    match["ebyCategories.id"] = { $in: e_cats };
  }

  const query: any = [];

  if (!isWholeSale) {
    query.push({
      $match: match,
    });
  }

  query.push(
    {
      $addFields: {
        [mrgnFieldName("e", false)]: {
          $round: [
            {
              $subtract: [
                "$e_pRange.median",
                {
                  $add: [
                    {
                      $divide: [
                        {
                          $multiply: ["$prc", { $divide: ["$e_qty", "$qty"] }],
                        },
                        {
                          $add: [
                            1,
                            { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                          ],
                        },
                      ],
                    },
                    "$e_tax",
                    transport,
                    strg,
                    e_prepCenter,
                    "$e_costs",
                  ],
                },
              ],
            },
            2,
          ],
        },
      },
    },
    {
      $match: { ...marginField({ target: "e", settings }) },
    },
    {
      $addFields: {
        [mrgnPctFieldName("e", false)]: {
          $round: [
            {
              $multiply: [
                {
                  $divide: [
                    `$${mrgnFieldName("e", false)}`,
                    "$e_pRange.median",
                  ],
                },
                100,
              ],
            },
            2,
          ],
        },
      },
    }
  );

  return query;
};
