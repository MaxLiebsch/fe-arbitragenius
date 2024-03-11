const fs = require("node:fs");

const str = fs.readFileSync("static/result.json");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const shops = [
  "idealo.de",
  "alternate.de",
  "mindfactory.de",
  "cyberport.de"
]

const products = JSON.parse(str);

const result = [];

for (let i = 0; i < products.length; i++) {
  const prod = products[i];
  result.push({
    s: shops[getRandomInt(shops.length)],
    ean: "",
    ctgry: "",
    mnfctr: prod.manufacturer,
    nm: prod.name,
    img: prod.image,
    lnk: prod.link,
    prc: prod.price,
    e_lnk: prod.ebay_link,
    e_img: prod.ebay_image,
    e_nm: prod.ebay_name,
    e_prc: prod.ebay_price,
    e_mrgn: prod.ebay_margin,
    e_fat: prod.ebay_profitable,
    e_mrgn_pct: prod.ebay_margin_pct,
    a_lnk: prod.amazon_link,
    a_img: prod.amazon_image,
    a_nm: prod.amazon_name,
    a_prc: prod.amazon_price,
    a_mrgn: prod.amazon_margin,
    a_fat: prod.amazon_profitable,
    a_mrgn_pct: prod.amazon_margin_pct,
  });
}

fs.writeFileSync("static/result2.json", JSON.stringify(result));
