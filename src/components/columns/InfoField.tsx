import React from "react";
import RetrieveAsin from "./RetrieveAsin";
import RetrieveEsin from "./RetrieveEsin";
import { ModifiedProduct } from "@/types/Product";
import ImageRenderer from "../ImageRenderer";
import { prefixLink } from "@/util/prefixLink";
import { LinkWrapper } from "../LinkWrapper";
import CopyToClipboard from "../CopyToClipboard";
import { ProductPagination } from "@/hooks/use-products";
import Link from "next/link";
import { parseISO } from "date-fns";
import { parseSalesRank } from "@/util/parseSalesRank";

const InfoField = ({
  product,
  target,
  userRoles,
  pagination,
}: {
  product: ModifiedProduct;
  target: string;
  pagination: ProductPagination;
  userRoles: string[];
}) => {
  const {
    img,
    s,
    lnk,
    nm,
    mnfctr,
    eanList,
    categoryTree,
    keepaUpdatedAt,
    salesRanks,
    bsr: initialBsr,
    monthlySold,
    qty,
    shop,
    ebyCategories,
    [`${target}_nm` as "a_nm" | "e_nm"]: targetName,
    [`${target}_lnk` as "a_lnk" | "e_lnk"]: targetLink,
    [`${target}_qty` as "a_qty" | "e_qty"]: targetQty,
    [`${target}_img` as "a_img" | "e_img"]: targetImg,
  } = product;
  let bsr = initialBsr;
  if (bsr && bsr.length) {
    if (salesRanks) {
      const bsrLastUpdate = parseISO(bsr[0].createdAt).getTime();
      const salesRanksLastUpdate = parseISO(keepaUpdatedAt).getTime();
      if (bsrLastUpdate < salesRanksLastUpdate && categoryTree !== null) {
        bsr = parseSalesRank(salesRanks, categoryTree);
      }
    }
  }
  return (
    <div className="flex flex-col divide-y p-1 w-full">
      <div className={`${nm?.length < 114 && "flex gap-1"}`}>
        <div className="flex flex-row gap-2">
          <div>{ImageRenderer(prefixLink(img, s))}</div>
          <div className="flex flex-col">
            <div>
              {shop && (
                <span className="font-semibold">
                  {shop!.slice(0, 1).toUpperCase() + shop!.slice(1)}:{" "}
                </span>
              )}
              <>
                {LinkWrapper(lnk, nm, mnfctr)}
                {qty > 1 && <div>({qty} Stück)</div>}
              </>
            </div> 
          </div>
        </div>
      </div>
      <div>
        <div className={`${targetName?.length < 114 && "flex gap-1"}`}>
          <div className="flex flex-row gap-2">
            <div>{ImageRenderer(prefixLink(targetImg, s))}</div>
            <div>
              {LinkWrapper(targetLink, targetName)}

              {targetQty > 1 && (
                <div className="inline">({targetQty} Stück)</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {target === "a" &&
        RetrieveAsin(targetLink, product, userRoles, target, pagination)}
      {target === "e" &&
        RetrieveEsin(targetLink, product, userRoles, target, pagination)}
      <>
        {target === "e" && ebyCategories && ebyCategories.length ? (
          <div>
            <span className="font-semibold">Kategorie:</span>
            <span>
              {ebyCategories.map((category: any) => {
                return (
                  <span className="mx-1" key={category.id + category.category}>
                    <Link
                      target="_blank"
                      href={
                        "https://www.ebay.de/b/" +
                        encodeURIComponent(category.category) +
                        "/" +
                        category.id
                      }
                    >
                      {category.category}
                    </Link>
                    <span className="font-semibold"> ID: </span>
                    <CopyToClipboard text={category.id} />
                  </span>
                );
              })}
            </span>
          </div>
        ) : (
          <></>
        )}
        {target === "a" && bsr && bsr.length ? (
          <div>
            <span className="font-semibold">BSR:</span>
            <span>
              {bsr.map((bsr: any) => {
                return (
                  <span className="mx-1" key={bsr.number + bsr.category}>
                    Nr.{bsr.number.toLocaleString("de-DE")} in {bsr.category}
                  </span>
                );
              })}
            </span>
          </div>
        ) : (
          <></>
        )}
        {target === "a" && monthlySold && (
          <div className="flex flex-row gap-2">
            {/* eigene Reihe */}
            <span>
              {monthlySold ? (
                <span>
                  <span className="font-semibold">Monatliche Sales:</span>
                  <span className="text-md"> {monthlySold}</span>
                </span>
              ) : (
                "Keine Sales verfügbar"
              )}
            </span>
          </div>
        )}
      </>
    </div>
  );
};

export default InfoField;
