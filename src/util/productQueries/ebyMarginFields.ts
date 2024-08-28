import { Settings } from "@/types/Settings";

export interface EbyCosts {
  transport: number;
  storage?: number;
  preCenter: number;
}

export const ebyMarginFields = (settings: Settings) => {
  const { tptStandard, strg, e_prepCenter } = settings;
  const transport = settings[tptStandard as "tptSmall"];
  return [
    {
      $match: {
        e_pblsh: true,
        e_prc: { $gt: 0 },
        e_uprc: { $gt: 0 },
      },
    },
    {
      $addFields: {
        e_mrgn: {
          $round: [
            {
              $subtract: [
                "$e_prc",
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
      $addFields: {
        e_mrgn_pct: {
          $round: [
            {
              $multiply: [
                {
                  $divide: ["$e_mrgn", "$e_prc"],
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
