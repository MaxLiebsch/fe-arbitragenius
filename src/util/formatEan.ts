export function formatEan(ean: any): string {
  return ean.toString().trim().padStart(13, "0");
}
