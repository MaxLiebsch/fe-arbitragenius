export function roundToTwoDecimals(num: number) {
  return Math.round(num * 100) / 100;
}

export function roundToFourDecimals(num: number) {
  return Math.round(num * 10000) / 10000
}
