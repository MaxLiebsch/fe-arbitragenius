export function lookupProductSeen(
  user: any,
  target: string
) {
  return [
    {
      $lookup: {
        from: "userSeen",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$userId", user.$id] },
                  { $eq: ["$target", target] },
                ],
              },
            },
          },
        ],
        as: "seenDocs",
      },
    },
    {
      $addFields: {
        seen: { $gt: [{ $size: "$seenDocs" }, 0] },
      },
    },
    {
      $project: {
        seenDocs: 0, // Omit the actual docs from the final result
      },
    },
  ];
}
