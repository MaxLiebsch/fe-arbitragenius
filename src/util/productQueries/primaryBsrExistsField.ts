
export function primaryBsrExistsField(aggregation: any[], isAmazon: boolean, productsWithNoBsr: boolean) {
    if (isAmazon && productsWithNoBsr) {
        aggregation.splice(2, 0, {
          $addFields: {
            primaryBsrExists: {
              $cond: {
                if: { $ifNull: ["$primaryBsr", false] },
                then: true,
                else: false,
              },
            },
          },
        });
      }
  }