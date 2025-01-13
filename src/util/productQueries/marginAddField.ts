import { mrgnFieldName } from "./mrgnProps";

export const marginAddField = ({
  euProgram,
  costs,
}: {
  euProgram: boolean;
  costs: (string | number)[];
}) => {
  return {
    $addFields: {
      [mrgnFieldName("a", euProgram)]: {
        $cond: {
          if: { $eq: ["$computedPrice", null] },
          then: null,
          else: {
            $round: [
              {
                $subtract: [
                  "$computedPrice",
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
                      ...costs,
                    ],
                  },
                ],
              },
              2,
            ],
          },
        },
      },
    },
  };
};
