type arbitrageOneUrlBuilderParams = {
  asin: string;
  sell_price: number;
  source_price: number;
  estimated_sales?: number;
  target_marketplace: string;
  source_url: string;
};

export function arbitrageOneUrlBuilder({
  asin,
  sell_price,
  source_price,
  estimated_sales,
  target_marketplace = "de",
  source_url,
}: arbitrageOneUrlBuilderParams) {
  const url = new URL(process.env.NEXT_PUBLIC_ARBITRAGE_ONE_URL + "/analyze");

  url.searchParams.append("asin", asin);
  url.searchParams.append("via", "arbispotter");
  url.searchParams.append("sell_price", sell_price.toString());
  url.searchParams.append("source_price", source_price.toString());
  url.searchParams.append("source_price_calculated_net", "0");
  url.searchParams.append("target_marketplace", target_marketplace);
  url.searchParams.append("source_url", source_url);

  if (estimated_sales) {
    url.searchParams.append("estimated_sales", estimated_sales.toString());
  }

  return url.href;
}
