import { Settings } from "@/types/Settings";
import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";
import { addAznSettingsFields } from "./addAznSettingsFields";

export const aznFlipFields = (settings: Settings, isWholesale?: boolean) => {
  const { a_tptStandard, a_strg, a_prepCenter, fba, euProgram } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];

  const match: any = {
    a_pblsh: true,
    "costs.azn": { $gt: 0 },
    aznUpdatedAt: { $gt: new Date(Date.now() - 96 * 60 * 1000).toISOString() },
    a_avg_fld: { $ne: null },
  };

  if (settings.a_cats.length > 0 && settings.a_cats[0] !== 0) {
    match["categoryTree.catId"] = { $in: settings.a_cats };
  }

  addAznSettingsFields(settings, match);

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
      $addFields: {
        a_avg_prc: "$a_avg_price",
        computedPrice: "$a_avg_price",
      },
    },
    {
      $addFields: {
        "costs.azn": {
          $round: [
            {
              $multiply: [
                {
                  $divide: ["$costs.azn", "$a_prc"],
                },
                "$computedPrice",
              ],
            },
            2,
          ],
        },
      },
    }
  );

  if (fba) {
    query.push(
      {
        $addFields: {
          [aznMrgn]: {
            $round: [
              {
                $subtract: [
                  "$computedPrice",
                  {
                    $add: [
                      {
                        $divide: [
                          "$a_prc",
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
                          "$computedPrice",
                          {
                            $divide: [
                              "$computedPrice",
                              {
                                $add: [
                                  1,
                                  { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      "$costs.tpt",
                      "$costs.varc",
                      a_prepCenter,
                      isSommer ? "$costs.strg_1_hy" : "$costs.strg_2_hy",
                      "$costs.azn",
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
        $match: {
          [aznMrgn]: { $gte: settings.minMargin },
        },
      },
      {
        $addFields: {
          [aznMrgnPct]: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [`$${aznMrgn}`, "$computedPrice"],
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
  } else {
    // If the user does not use Azn FBA, then the margin is calculated,
    // based on there settings for transport, storage, and preparation center
    query.push(
      {
        $addFields: {
          [aznMrgn]: {
            $round: [
              {
                $subtract: [
                  "$computedPrice", // VK
                  {
                    $add: [
                      // EK * (VK qty/ EK qty)  * divide (1 + MwSt) Steuern EK
                      {
                        $divide: [
                          "$a_prc",
                          {
                            $add: [
                              1,
                              { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                            ],
                          },
                        ],
                      },
                      // Steuern VK
                      {
                        $subtract: [
                          "$computedPrice",
                          {
                            $divide: [
                              "$computedPrice",
                              {
                                $add: [
                                  1,
                                  { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      transport,
                      a_strg,
                      a_prepCenter,
                      "$costs.azn",
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
        $match: {
          a_avg_prc: { $gt: 0 },
        },
      },
      {
        $addFields: {
          [aznMrgnPct]: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [`$${aznMrgn}`, "$computedPrice"],
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
  }

  return query;
};
