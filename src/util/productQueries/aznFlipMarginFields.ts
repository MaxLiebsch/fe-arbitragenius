import { Settings } from "@/types/Settings";

export const aznFlipMarginFields = (
  settings: Settings,
  isWholesale?: boolean
) => {
  const { a_tptStandard, a_strg, a_prepCenter, fba, euProgram } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];

  const match: any = {
    a_pblsh: true,
    a_prc: { $gt: 0 },
    costs: { $exists: true },
    aznUpdatedAt: { $gt: new Date(Date.now() - 96 * 60 * 1000).toISOString() },
    $or: [
      { avg30_ahsprcs: { $exists: true, $gt: 0 } },
      { avg30_ansprcs: { $exists: true, $gt: 0 } },
      { avg90_ahsprcs: { $exists: true, $gt: 0 } },
      { avg90_ansprcs: { $exists: true, $gt: 0 } },
    ],
  };

  if (settings.a_cats.length > 0 && settings.a_cats[0] !== 0) {
    match["categoryTree.catId"] = { $in: settings.a_cats };
  }

  const query: any = [];

  if (!isWholesale) {
    query.push({
      $match: match,
    });
  }

  const isEuProgram = !euProgram ? "_p" : "";
  const isSommer = new Date().getMonth() < 9;
  const winter = isSommer ? "" : "_w";

  query.push(
    {
      $addFields: {
        a_avg_prc: {
          $divide: [
            {
              $cond: {
                if: { $gt: ["$avg30_ahsprcs", -1] },
                then: "$avg30_ahsprcs",
                else: {
                  $cond: {
                    if: { $gt: ["$avg30_ansprcs", -1] },
                    then: "$avg30_ansprcs",
                    else: {
                      $cond: {
                        if: { $gt: ["$avg90_ahsprcs", -1] },
                        then: "$avg90_ahsprcs",
                        else: "$avg90_ansprcs",
                      },
                    },
                  },
                },
              },
            },
            100,
          ],
        },
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
                "$a_avg_prc",
              ],
            },
            2,
          ],
        },
      },
    }
  );

  if (!fba) {
    // If the user does not use Azn FBA, then the margin is calculated,
    // based on there settings for transport, storage, and preparation center
    query.push(
      {
        $addFields: {
          [`a${isEuProgram}_mrgn`]: {
            $round: [
              {
                $subtract: [
                  "$a_avg_prc", // VK
                  {
                    $add: [
                      // EK * (VK qty/ EK qty)  * divide (1 + MwSt) Steuern EK
                      {
                        $divide: [
                          {
                            $multiply: [
                              "$a_prc",
                              { $divide: ["$a_qty", "$qty"] },
                            ],
                          },
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
                          "$a_avg_prc",
                          {
                            $divide: [
                              "$a_avg_prc",
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
        $addFields: {
          [`a${isEuProgram}_mrgn_pct`]: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [`$a${isEuProgram}_mrgn`, "$a_avg_prc"],
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
    query.push(
      {
        $addFields: {
          [`a${isEuProgram}_mrgn`]: {
            $round: [
              {
                $subtract: [
                  "$a_avg_prc",
                  {
                    $add: [
                      {
                        $divide: [
                          {
                            $multiply: [
                              "$a_prc",
                              { $divide: ["$a_qty", "$qty"] },
                            ],
                          },
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
                                  { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      "$costs.tpt",
                      "$costs.varc",
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
        $addFields: {
          [`a${isEuProgram}_mrgn_pct`]: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [`$a${isEuProgram}_mrgn`, "$a_avg_prc"],
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
