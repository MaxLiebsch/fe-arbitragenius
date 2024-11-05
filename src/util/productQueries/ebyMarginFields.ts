import { Settings } from "@/types/Settings";

export const ebyMarginFields = (
  settings: Settings,
  sdmn?: string,
  isWholeSale?: boolean
) => {
  const { tptStandard, strg, e_prepCenter, e_cats } = settings;
  const transport = settings[tptStandard as "tptSmall"];
  const match: any = {
    e_pblsh: true,
    e_prc: { $gt: 0 },
    e_uprc: { $gt: 0 },
  };

  if (sdmn) {
    match.sdmn = sdmn;
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
    }
  );

  return query;
};
