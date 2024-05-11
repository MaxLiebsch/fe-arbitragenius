export interface ProductTableRow {
  id: string;
  manufacturer: string | undefined;
  category: string | undefined
  name: string | undefined;
  image: string | undefined;
  link: string | undefined;
  a_bsr: string | undefined;
  a_link: string | undefined;
  a_image: string | undefined;
  a_name: string | undefined;
  a_price: string | undefined;
  a_margin: string | undefined;
  a_profitable: boolean | undefined;
  a_margin_pct: string | undefined;
  e_link: string | undefined;
  e_image: string | undefined;
  e_name: string | undefined;
  e_price: string | undefined;
  e_margin: string | undefined;
  e_profitable: boolean | undefined;
  e_margin_pct: string | undefined;
}
