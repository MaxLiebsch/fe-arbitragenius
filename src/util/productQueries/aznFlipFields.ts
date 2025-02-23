import { Settings } from "@/types/Settings";
import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";
import { addAznSettingsFields } from "./addAznSettingsFields";

export const aznFlipFields = ({
  settings,
  isWholesale,
}: {
  settings: Settings;
  isWholesale?: boolean;
}) => {
  const { a_tptStandard, a_strg, a_prepCenter, fba, euProgram } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];

  const match: any = {
    $and: [
      { a_avg_fld: "avg30_buyBoxPrice" },
      { a_avg_price: { $gt: 1 } },
      { a_prc: { $gt: 1 } },
    ],
  };

  if (settings.a_cats.length > 0 && settings.a_cats[0] !== 0) {
    match.$and.push({
      "categoryTree.catId": { $in: settings.a_cats, $nin: [11961464031] },
    });
  }

  if (!match.$and.some((m: any) => m["categoryTree.catId"])) {
    match.$and.push({
      "categoryTree.catId": {
        $nin: [11961464031],
      },
    });
  }
  addAznSettingsFields(settings, match);

  match.$and.push({
    keepaUpdatedAt: {
      $gt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 24 hours
    },
  });

  const query: any = [];

  if (!isWholesale) {
    query.push({
      $match: match,
    });
  }

  const isSommer = new Date().getMonth() < 9;
  const aznMrgn = mrgnFieldName("a", euProgram);
  const aznMrgnPct = mrgnPctFieldName("a", euProgram);

  query.push(
    {
      $group: {
        _id: {
          field2: "$asin",
        },
        document: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$document" },
    }
  );

  const costs = fba
    ? [
        "$costs.azn",
        "$costs.tpt",
        "$costs.varc",
        isSommer ? "$costs.strg_1_hy" : "$costs.strg_2_hy",
        a_prepCenter,
      ]
    : [transport, a_strg, a_prepCenter, "$costs.azn"];

  query.push(
    {
      $addFields: {
        a_avg_prc: "$a_avg_price",
        curr_prc: {
          $switch: {
            branches: [
              // If both fields are greater than -1, choose the minimum.
              {
                case: { 
                  $and: [
                    { $gt: ["$curr_ahsprcs", -1] },
                    { $gt: ["$curr_ansprcs", -1] }
                  ]
                },
                then: { $min: ["$curr_ahsprcs", "$curr_ansprcs"] }
              },
              // If curr_ahsprcs is -1 but curr_ansprcs is valid, choose curr_ansprcs.
              {
                case: { 
                  $and: [
                    { $eq: ["$curr_ahsprcs", -1] },
                    { $gt: ["$curr_ansprcs", -1] }
                  ]
                },
                then: "$curr_ansprcs"
              },
              // If curr_ansprcs is -1 but curr_ahsprcs is valid, choose curr_ahsprcs.
              {
                case: { 
                  $and: [
                    { $eq: ["$curr_ansprcs", -1] },
                    { $gt: ["$curr_ahsprcs", -1] }
                  ]
                },
                then: "$curr_ahsprcs"
              }
            ],
            // Default to null (or another value) if both are -1 or none of the conditions match.
            default: null
          }
        },
      },
    },
    {
      $addFields: {
        "costs.azn": {
          $round: [
            {
              $multiply: [{ $divide: ["$costs.azn", "$a_prc"] }, "$a_avg_prc"],
            },
            2,
          ],
        },
      },
    },
    {
      $addFields: {
        [aznMrgn]: {
          $round: [
            {
              $subtract: [
                "$a_avg_prc",
                {
                  $add: [
                    {
                      $divide: [
                        "$curr_prc",
                        {
                          $add: [
                            1,
                            { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                          ],
                        },
                      ],
                    },
                    {
                      $subtract: [
                        "$a_avg_prc",
                        {
                          $divide: [
                            "$a_avg_prc",
                            {
                              $add: [
                                1,
                                {
                                  $divide: [{ $ifNull: ["$tax", 19] }, 100],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    ...costs,
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
      $addFields: {
        [aznMrgnPct]: {
          $round: [
            {
              $multiply: [{ $divide: ["$a_mrgn", "$a_avg_prc"] }, 100],
            },
            2,
          ],
        },
      },
    }
  );

  return query;
};
