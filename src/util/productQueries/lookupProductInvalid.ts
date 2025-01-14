export function lookupProductInvalid(user: any, target: string) {
  return [
    {
      $lookup: {
        from: "userInvalid",
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
        as: "invalidDocs",
      },
    },
    // Exclude invalid
    {
      $match: { invalidDocs: { $eq: [] } },
    },
  ];
}
