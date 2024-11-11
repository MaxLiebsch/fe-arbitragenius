export const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export const percentFormatter = new Intl.NumberFormat("de-DE", {
  style: "percent",
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export function formatCurrency(price?: number) {
  if (price) {
    return formatter.format(price);
  } else {
    return "";
  }
}

export function appendPercentage(margin_pct?: number) {
  if (margin_pct) {
    return percentFormatter.format(margin_pct / 100);
  } else {
    return "";
  }
}

const regexp = /\d{1,5}(?:[.,]\d{3})*(?:[.,]\d{2,4})/g;
const regex = /[^A-Za-z0-9\s,.öäÖÄüÜ\-]/g;

export const getPrice = (priceStr: string) => {
  const match = priceStr.match(regexp);
  if (match) {
    return match[0]
      .replace(regex, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } else {
    return null;
  }
};
