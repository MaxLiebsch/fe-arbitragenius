export function lookupProductIrrelevant(user: any, target: string) {
  return [
    {
      $lookup: {
        from: "userIrrelevant",
        let: { pid: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$pid"] },
                  { $eq: ["$userId", user.$id] },
                  { $eq: ["$target", target] },
                ],
              },
            },
          },
        ],
        as: "irrelevantDocs",
      },
    },
    // Exclude invalid
    {
      $match: { invalidDocs: { $eq: [] } },
    },
  ];
}
