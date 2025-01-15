import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";

export const marginPctAddField = ({ euProgram }: { euProgram: boolean }) => {
  return {
    $addFields: {
      [mrgnPctFieldName("a", euProgram)]: {
        $cond: {
          if: { $eq: [`$${mrgnFieldName("a", euProgram)}`, null] },
          then: null,
          else: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      `$${mrgnFieldName("a", euProgram)}`,
                      "$computedPrice",
                    ],
                  },
                  100,
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
