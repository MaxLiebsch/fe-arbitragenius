import { Settings } from "@/types/Settings";

export const aznMarginFields = (settings: Settings) => {
  const { a_tptStandard, a_strg, a_prepCenter } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];
  return [
    {
      $match: {
        a_pblsh: true,
        a_prc: { $gt: 0 },
        a_uprc: { $gt: 0 },
      },
    },
    {
      $addFields: {
        a_mrgn: {
          $round: [
            {
              $subtract: [
                "$a_prc",
                {
                  $add: [
                    {
                      $divide: [
                        {
                          $multiply: ["$prc", { $divide: ["$a_qty", "$qty"] }],
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
        a_mrgn_pct: {
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
    },
  ];
};
