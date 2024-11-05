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
import { formatDistanceToNow, parseISO } from "date-fns";
import { parseSalesRank } from "@/util/parseSalesRank";
import { de } from "date-fns/locale";
import { aznCategoryMapping } from "@/constant/constant";
import { targetLinkBuilder } from "@/util/targetLinkBuilder";

const InfoField = ({
  product,
  target,
  flip,
  userRoles,
  pagination,
}: {
  product: ModifiedProduct;
  target: string;
  flip?: boolean;
  pagination: ProductPagination;
  userRoles: string[];
}) => {
  const {
    img,
    s,
    sdmn,
    lnk,
    nm,
    mnfctr,
    asin,
    categoryTree,
    keepaUpdatedAt,
    salesRanks,
    availUpdatedAt,
    updatedAt,
    dealAznUpdatedAt,
    dealEbyUpdatedAt,
    bsr: initialBsr,
    drops30,
    drops90,
    monthlySold,
    qty,
    shop,
    ebyCategories,
    [`${target}_nm` as "a_nm" | "e_nm"]: targetName,
    [`${target}_img` as "a_img" | "e_img"]: targetImg,
  } = product;

  const targetLink = targetLinkBuilder(target, product)

  const shopDomain = sdmn !== "sales" ? sdmn : shop !== undefined ? s : "";

  const targetUpdatedAt =
    target === "a"
      ? dealAznUpdatedAt || updatedAt
      : dealEbyUpdatedAt || updatedAt;
  const lastUpdated = availUpdatedAt || updatedAt;

  let bsr = initialBsr;
  let aznCategory = null;
  if (bsr && bsr.length) {
    if (salesRanks) {
      const bsrLastUpdate = parseISO(bsr[0].createdAt).getTime();
      const salesRanksLastUpdate = keepaUpdatedAt
        ? parseISO(keepaUpdatedAt).getTime()
        : new Date().getTime();
      if (bsrLastUpdate < salesRanksLastUpdate && categoryTree) {
        bsr = parseSalesRank(salesRanks, categoryTree);
      }
    }
    if (categoryTree && categoryTree.length) {
      aznCategory = aznCategoryMapping.find(
        (cat) => cat.value === categoryTree[0].catId
      );
    }
  }
  const isFlip = shop === "flip";
  return (
    <div className="flex flex-col divide-y p-1 w-full">
      {nm && !flip && !isFlip && (
        <div className={`${nm?.length < 114 && "flex gap-1"}`}>
          <div className="flex flex-row gap-2 w-full">
            <div>{ImageRenderer(prefixLink(img, shopDomain))}</div>
            <div className="flex flex-col w-full">
              {shop && (
                <span className="font-semibold">
                  {shop!.slice(0, 1).toUpperCase() + shop!.slice(1)}:{" "}
                </span>
              )}
              <>{LinkWrapper(lnk, nm, mnfctr)}</>
              {lastUpdated && (
                <time className="ml-auto mt-auto text-gray-500 text-xs">
                  {formatDistanceToNow(parseISO(lastUpdated), {
                    locale: de,
                    addSuffix: true,
                  })}
                </time>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
        <div className={`w-full ${targetName?.length < 114 && "flex gap-1"}`}>
          <div className="flex flex-row gap-2 w-full">
            <div>{ImageRenderer(prefixLink(targetImg, s))}</div>
            <div className="flex flex-col w-full">
              <div>{LinkWrapper(targetLink, targetName)}</div>
              {targetUpdatedAt && (
                <time className="ml-auto mt-auto text-gray-500 text-xs">
                  {formatDistanceToNow(parseISO(targetUpdatedAt), {
                    locale: de,
                    addSuffix: true,
                  })}
                </time>
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
            <span className="font-semibold">Kategorie:</span>
            {aznCategory && (
              <span className="mx-1" key={aznCategory.label + asin}>
                {aznCategory.label}
              </span>
            )}
          </div>
        ) : (
          <></>
        )}
        {target === "a" && (monthlySold || drops30 || drops90) && (
          <div className="flex flex-row gap-2">
            {monthlySold && (
              <span>
                <span className="font-semibold">Monatliche Sales:</span>
                <span className="text-md"> {monthlySold}</span>
              </span>
            )}
            <span>
              <span className="font-semibold">Keepa Drops (30):</span>
              <span className="text-md"> {drops30 ? drops30 : 0}</span>
            </span>
            <span>
              <span className="font-semibold">Keepa Drops (90):</span>
              <span className="text-md"> {drops90 ? drops90 : 0}</span>
            </span>
          </div>
        )}
      </>
    </div>
  );
};

export default InfoField;
