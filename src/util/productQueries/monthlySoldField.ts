export function monthlySoldField(findQuery: any[], monthlySold: number) {
  if (monthlySold > 0) {
    findQuery.push({
      monthlySold: { $gte: monthlySold },
    });
  }
}
