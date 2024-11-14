export function lookupUserId(aggregation: any[], user: any, target: string) {
  aggregation.push(
    {
      $lookup: {
        from: "users",
        let: { productId: "$_id", target },
        pipeline: [
          { $match: { userId: user.$id } },
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
    {
      $addFields: {
        isBookmarked: { $gt: [{ $size: "$isBookmarked" }, 0] },
      },
    }
  );
}
