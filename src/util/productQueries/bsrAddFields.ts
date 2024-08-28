export const bsrAddFields = {
  $addFields: {
    primaryBsr: {
      $cond: {
        if: {
          $size: {
            $ifNull: [
              {
                $cond: {
                  if: { $eq: [{ $type: "$bsr" }, "array"] },
                  then: "$bsr",
                  else: [],
                },
              },
              [],
            ],
          },
        },
        then: { $arrayElemAt: ["$bsr", 0] },
        else: null,
      },
    },
    secondaryBsr: {
      $cond: {
        if: {
          $size: {
            $ifNull: [
              {
                $cond: {
                  if: { $eq: [{ $type: "$bsr" }, "array"] },
                  then: "$bsr",
                  else: [],
                },
              },
              [],
            ],
          },
        },
        then: { $arrayElemAt: ["$bsr", 1] },
        else: null,
      },
    },
    thirdBsr: {
      $cond: {
        if: {
          $size: {
            $ifNull: [
              {
                $cond: {
                  if: { $eq: [{ $type: "$bsr" }, "array"] },
                  then: "$bsr",
                  else: [],
                },
              },
              [],
            ],
          },
        },
        then: { $arrayElemAt: ["$bsr", 2] },
        else: null,
      },
    },
    primaryBsrExists: {
      $cond: {
        if: [{ $ne: ["$primaryBsr", null] }],
        then: true,
        else: false,
      },
    },
  },
};
