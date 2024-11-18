const flipCntQuery = [
  {
    $match: {
      a_pblsh: true,
      a_prc: { $gt: 0 },
      "costs.azn": { $gt: 0 },
      aznUpdatedAt: { $gt: "2024-11-18T10:37:36.685Z" },
      $or: [
        { avg30_ahsprcs: { $gt: 0 } },
        { avg30_ansprcs: { $gt: 0 } },
        { avg90_ahsprcs: { $gt: 0 } },
        { avg90_ansprcs: { $gt: 0 } },
      ],
      buyBoxIsAmazon: { $in: [true, false, null] },
      $and: [
        { bsr: { $size: 1 } },
        { "bsr.number": { $gt: 0, $lte: 1000000 } },
      ],
    },
  },
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
          { $multiply: [{ $divide: ["$costs.azn", "$a_prc"] }, "$a_avg_prc"] },
          2,
        ],
      },
    },
  },
  {
    $addFields: {
      a_w_mrgn: {
        $round: [
          {
            $subtract: [
              "$a_avg_prc",
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
                  "$costs.strg_2_hy",
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
      a_w_mrgn_pct: {
        $round: [
          { $multiply: [{ $divide: ["$a_w_mrgn", "$a_avg_prc"] }, 100] },
          2,
        ],
      },
    },
  },
  { $match: { a_w_mrgn: { $gt: 0 } } },
  { $group: { _id: { field2: "$asin" }, document: { $first: "$$ROOT" } } },
  { $replaceRoot: { newRoot: "$document" } },
  { $count: "productCount" },
];

const flipQuery = [
  {
    $match: {
      a_pblsh: true,
      a_prc: { $gt: 0 },
      "costs.azn": { $gt: 0 },
      aznUpdatedAt: { $gt: "2024-11-18T10:40:05.710Z" },
      $or: [
        { avg30_ahsprcs: { $gt: 0 } },
        { avg30_ansprcs: { $gt: 0 } },
        { avg90_ahsprcs: { $gt: 0 } },
        { avg90_ansprcs: { $gt: 0 } },
      ],
      buyBoxIsAmazon: { $in: [true, false, null] },
      $and: [
        { bsr: { $size: 1 } },
        { "bsr.number": { $gt: 0, $lte: 1000000 } },
      ],
    },
  },
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
          { $multiply: [{ $divide: ["$costs.azn", "$a_prc"] }, "$a_avg_prc"] },
          2,
        ],
      },
    },
  },
  {
    $addFields: {
      a_w_mrgn: {
        $round: [
          {
            $subtract: [
              "$a_avg_prc",
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
                  "$costs.strg_2_hy",
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
      a_w_mrgn_pct: {
        $round: [
          { $multiply: [{ $divide: ["$a_w_mrgn", "$a_avg_prc"] }, 100] },
          2,
        ],
      },
    },
  },
  { $match: { a_w_mrgn: { $gt: 0 } } },
  {
    $project: {
      prc: 1,
      uprc: 1,
      lnk: 1,
      img: 1,
      nm: 1,
      eanList: 1,
      s: 1,
      qty_v: 1,
      nm_v: 1,
      ean: 1,
      availUpdatedAt: 1,
      qty: 1,
      createdAt: 1,
      updatedAt: 1,
      tax: 1,
      shop: 1,
      _id: 1,
      mnfctr: 1,
      sdmn: 1,
      a_pblsh: 1,
      a_nm: 1,
      a_useCurrPrice: 1,
      a_cur: 1,
      a_rating: 1,
      a_reviewcnt: 1,
      bsr: 1,
      a_img: 1,
      a_avg_prc: 1,
      dealAznUpdatedAt: 1,
      asin: 1,
      a_prc: 1,
      costs: 1,
      a_uprc: 1,
      a_qty: 1,
      a_orgn: 1,
      a_mrgn: 1,
      a_mrgn_pct: 1,
      a_w_mrgn: 1,
      a_w_mrgn_pct: 1,
      a_p_w_mrgn: 1,
      a_p_w_mrgn_pct: 1,
      a_p_mrgn: 1,
      a_vrfd: 1,
      a_p_mrgn_pct: 1,
      drops30: 1,
      drops90: 1,
      categories: 1,
      numberOfItems: 1,
      availabilityAmazon: 1,
      categoryTree: 1,
      salesRanks: 1,
      monthlySold: 1,
      ahstprcs: 1,
      anhstprcs: 1,
      auhstprcs: 1,
      curr_ahsprcs: 1,
      curr_ansprcs: 1,
      curr_ausprcs: 1,
      curr_salesRank: 1,
      avg30_ahsprcs: 1,
      avg30_ansprcs: 1,
      avg30_ausprcs: 1,
      avg30_salesRank: 1,
      avg90_ahsprcs: 1,
      avg90_ansprcs: 1,
      avg90_ausprcs: 1,
      avg90_salesRank: 1,
      buyBoxIsAmazon: 1,
      stockAmount: 1,
      stockBuyBox: 1,
      totalOfferCount: 1,
    },
  },
  { $group: { _id: { field2: "$asin" }, document: { $first: "$$ROOT" } } },
  { $replaceRoot: { newRoot: "$document" } },
  { $sort: { "bsr.number": 1, a_w_mrgn_pct: -1 } },
  { $skip: 0 },
  { $limit: 20 },
  {
    $lookup: {
      from: "users",
      let: { productId: "$_id", target: "a" },
      pipeline: [
        { $match: { userId: "6630990d0021e4c6bce4" } },
        { $unwind: "$bookmarks" },
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$bookmarks.productId", "$$productId"] },
                { $eq: ["$bookmarks.target", "$$target"] },
              ],
            },
          },
        },
        { $project: { _id: 1 } },
      ],
      as: "isBookmarked",
    },
  },
  { $addFields: { isBookmarked: { $gt: [{ $size: "$isBookmarked" }, 0] } } },
];
