export function addMonthlySoldField(findQuery: any, monthlySold: number) {
  if (monthlySold > 0) {
    findQuery['monthlySold'] = { $gte: monthlySold };
  }
}

export function monthlySoldField(monthlySold: number) {
  if (monthlySold > 0) {
    return {
      monthlySold: { $gte: monthlySold },
    };
  }
}
