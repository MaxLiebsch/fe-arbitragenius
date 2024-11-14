export const calculationDeduction = (price: number, netto: boolean) => {
  if (netto) {
    return price / 1.19;
  } else {
    return price;
  }
};
