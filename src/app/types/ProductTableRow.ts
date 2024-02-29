export interface ProductTableRow {
    id: string;
    manufacturer: string| undefined
    name: string| undefined
    image: string| undefined
    link: string| undefined
    amazon_link: string| undefined
    amazon_image: string| undefined
    amazon_name: string| undefined
    amazon_price: string| undefined
    amazon_margin: string| undefined
    amazon_profitable: boolean | undefined
    amazon_margin_pct: string| undefined
    ebay_link: string| undefined
    ebay_image: string| undefined
    ebay_name: string| undefined
    ebay_price: string| undefined
    ebay_margin: string| undefined
    ebay_profitable: boolean | undefined
    ebay_margin_pct: string| undefined
  }

