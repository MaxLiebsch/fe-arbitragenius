const aznCntQuery = [
  {
    $match: {
      sdmn: "idealo.de",
      a_pblsh: true,
      a_prc: { $gt: 0 },
      buyBoxIsAmazon: { $in: [true, false, null] },
      $and: [
        { bsr: { $size: 1 } },
        { "bsr.number": { $gt: 0, $lte: 1000000 } },
      ],
    },
  },
  { $match: { a_w_mrgn: { $gt: 0 } } },
  { $count: "productCount" },
];

const aznProductQuery = [
  {
    $match: {
      sdmn: "idealo.de",
      a_pblsh: true,
      a_prc: { $gt: 0 },
      buyBoxIsAmazon: { $in: [true, false, null] },
      $and: [
        { bsr: { $size: 1 } },
        { "bsr.number": { $gt: 0, $lte: 1000000 } },
      ],
      a_w_mrgn: { $gt: 0 },
    },
  },
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

const ebyCntQuery = [
  {
    $match: {
      e_pblsh: true,
      e_prc: { $gt: 0 },
      sdmn: "idealo.de",
      e_mrgn: { $gt: 0 },
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
                      { $multiply: ["$prc", { $divide: ["$e_qty", "$qty"] }] },
                      {
                        $add: [
                          1,
                          { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                        ],
                      },
                    ],
                  },
                  "$e_tax",
                  4.95,
                  0,
                  0,
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
  { $match: { e_mrgn: { $gt: 0 } } },
  {
    $addFields: {
      e_mrgn_pct: {
        $round: [{ $multiply: [{ $divide: ["$e_mrgn", "$e_prc"] }, 100] }, 2],
      },
    },
  },

  { $count: "productCount" },
];

const ebyProductQuery = [
  { $match: { e_pblsh: true, e_prc: { $gt: 0 }, sdmn: "idealo.de" } },
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
                      { $multiply: ["$prc", { $divide: ["$e_qty", "$qty"] }] },
                      {
                        $add: [
                          1,
                          { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                        ],
                      },
                    ],
                  },
                  "$e_tax",
                  4.95,
                  0,
                  0,
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
        $round: [{ $multiply: [{ $divide: ["$e_mrgn", "$e_prc"] }, 100] }, 2],
      },
    },
  },
  { $match: { e_mrgn: { $gt: 0 } } },
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
      e_pblsh: 1,
      e_nm: 1,
      e_cur: 1,
      e_img: 1,
      esin: 1,
      dealEbyUpdatedAt: 1,
      e_prc: 1,
      e_uprc: 1,
      e_qty: 1,
      e_orgn: 1,
      e_pRange: 1,
      e_mrgn: 1,
      e_mrgn_pct: 1,
      e_ns_costs: 1,
      e_ns_mrgn: 1,
      e_ns_mrgn_pct: 1,
      e_tax: 1,
      ebyCategories: 1,
      e_vrfd: 1,
    },
  },
  { $sort: { e_mrgn_pct: -1 } },
  { $skip: 20 },
  { $limit: 20 },
  {
    $lookup: {
      from: "users",
      let: { productId: "$_id", target: "e" },
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
