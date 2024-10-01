import { Settings } from "@/types/Settings";

export const aznMarginFields = (settings: Settings, isWholesale?: boolean) => {
  const { a_tptStandard, a_strg, a_prepCenter, fba, euProgram } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];

  const match: any = {
    a_pblsh: true,
    a_prc: { $gt: 0 },
    a_uprc: { $gt: 0 },
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
                  "$a_prc",
                  {
                    $add: [
                      {
                        $divide: [
                          {
                            $multiply: [
                              "$prc",
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
                          "$a_prc",
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
                    $divide: ["$a_mrgn", "$a_prc"],
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
