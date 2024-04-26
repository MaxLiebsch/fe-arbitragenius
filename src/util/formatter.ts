export const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(price?: string) {
  if (price) {
    return formatter.format(parseFloat(price));
  } else {
    return "";
  }
}

export function appendPercentage(margin_pct?: string) {
  if (margin_pct) {
    return margin_pct + " %";
  } else {
    return "";
  }
}
