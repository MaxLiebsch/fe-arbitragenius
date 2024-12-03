const ebay = [
  {
    $match: {
      e_pblsh: true,
      e_prc: { $gt: 0 },
      sdmn: "sales",
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
  {
    $addFields: {
      e_mrgn_pct: {
        $round: [{ $multiply: [{ $divide: ["$e_mrgn", "$e_prc"] }, 100] }, 2],
      },
    },
  },
  {
    $facet: {
      totalProducts: [
        {
          $match: {
            e_pblsh: true,
            e_prc: { $gt: 0 },
            sdmn: "sales",
            e_mrgn: { $gt: 0 },
          },
        },
        { $count: "count" },
      ],
      totalProductsToday: [
        {
          $match: {
            e_pblsh: true,
            e_prc: { $gt: 0 },
            sdmn: "sales",
            e_mrgn: { $gt: 0 },
            createdAt: {
              $gte: "2024-11-17T23:00:00.000Z",
              $lt: "2024-11-18T23:00:00.000Z",
            },
          },
        },
        { $count: "count" },
      ],
    },
  },
  {
    $project: {
      productCount: { $arrayElemAt: ["$totalProducts.count", 0] },
      totalProductsToday: { $arrayElemAt: ["$totalProductsToday.count", 0] },
    },
  },
];
const azn = [
  {
    $match: {
      sdmn: "sales",
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
    $facet: {
      totalProducts: [
        {
          $match: {
            sdmn: "sales",
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
        { $count: "count" },
      ],
      totalProductsToday: [
        {
          $match: {
            sdmn: "sales",
            a_pblsh: true,
            a_prc: { $gt: 0 },
            buyBoxIsAmazon: { $in: [true, false, null] },
            $and: [
              { bsr: { $size: 1 } },
              { "bsr.number": { $gt: 0, $lte: 1000000 } },
            ],
            a_w_mrgn: { $gt: 0 },
            createdAt: {
              $gte: "2024-11-17T23:00:00.000Z",
              $lt: "2024-11-18T23:00:00.000Z",
            },
          },
        },
        { $count: "count" },
      ],
    },
  },
  {
    $project: {
      productCount: { $arrayElemAt: ["$totalProducts.count", 0] },
      totalProductsToday: { $arrayElemAt: ["$totalProductsToday.count", 0] },
    },
  },
];

