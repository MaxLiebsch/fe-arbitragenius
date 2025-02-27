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
import { de } from "date-fns/locale";
import { targetLinkBuilder } from "@/util/targetLinkBuilder";
import { getLatestBsr } from "@/util/getLatestBsr";
import Eanlist from "../Eanlist";
import { Tooltip } from "antd";
import DeliveryStatus from "../DeliveryStatus";
import { createUnixTimeFromKeepaTime } from "../KeepaGraph";

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
    a,
    lnk,
    nm,
    mnfctr,
    asin,
    availUpdatedAt,
    createdAt,
    updatedAt,
    dealAznUpdatedAt,
    dealEbyUpdatedAt,
    drops30,
    seen,
    esin,
    keepaUpdatedAt,
    monthlySoldSource,
    lastSoldUpdate,
    monthlySoldHistory,
    drops90,
    timer,
    shop,
    sourceDomain,
    ebyCategories,
    [`${target}_nm` as "a_nm" | "e_nm"]: targetName,
    [`${target}_img` as "a_img" | "e_img"]: targetImg,
  } = product;

  let { monthlySold } = product;

  let lastMonthlySoldUpdatedAt = lastSoldUpdate
    ? formatDistanceToNow(createUnixTimeFromKeepaTime(lastSoldUpdate) * 1000, {
        locale: de,
        addSuffix: true,
      })
    : null;

  const lastMonthlySold =
    monthlySoldHistory?.length && monthlySoldHistory.length > 0
      ? monthlySoldHistory.reverse().find(([date, sold]) => sold !== -1)
      : null;

  if (lastMonthlySold && monthlySoldSource !== "keepa") {
    if (lastMonthlySold[1] !== -1) {
      monthlySold = lastMonthlySold[1];
      lastMonthlySoldUpdatedAt = formatDistanceToNow(
        lastMonthlySold[0] * 1000,
        {
          locale: de,
          addSuffix: true,
        }
      );
    }
  }

  const targetLink = targetLinkBuilder(target, product);

  const shopDomain = sdmn !== "sales" ? sdmn : shop !== undefined ? s : "";

  const isFlip = shop === "flip" || flip;
  const targetUpdatedAt =
    target === "a"
      ? isFlip
        ? keepaUpdatedAt
        : dealAznUpdatedAt || updatedAt
      : dealEbyUpdatedAt || updatedAt;

  const { bsr, aznCategory } = getLatestBsr(product);

  const lastUpdated = availUpdatedAt || updatedAt;
  if ((!esin && target === "e") || (!asin && target === "a"))
    return <Eanlist eanList={product.eanList} />;

  return (
    <div className="relative w-full">
      {typeof timer === "number" && !seen ? (
        <div className="absolute right-2 top-1 text-xs text-gray">
          {timer > 0
            ? `Als gesehen markiert in ${
                timer === 1 ? "einer" : timer
              } Sekunde${timer > 1 ? "n" : ""}`
            : "Gesehen"}
        </div>
      ) : null}
      {seen ? (
        <div className="absolute right-2 top-1 text-xs text-gray">Gesehen</div>
      ) : null}
      <div className="flex flex-col divide-y p-1 w-full">
        {nm && !isFlip && (
          <div className={`${nm?.length < 114 && "flex gap-1"}`}>
            <div className="flex flex-row gap-2 w-full">
              <div>{ImageRenderer(prefixLink(img, shopDomain))}</div>
              <div className="flex flex-col w-full">
                {sourceDomain ? (
                  <span className="font-semibold">
                    {sourceDomain!.slice(0, 1).toUpperCase() +
                      sourceDomain!.slice(1)}
                    :{" "}
                  </span>
                ) : (
                  <span className="font-semibold">
                    {shop!.slice(0, 1).toUpperCase() + shop!.slice(1)}:{" "}
                  </span>
                )}
                <>{LinkWrapper(lnk, nm, mnfctr)}</>
                <div className="flex flex-row w-full justify-between mt-auto">
                  {createdAt && (
                    <time className="text-gray text-xs">
                      Erstellt{" "}
                      {formatDistanceToNow(parseISO(createdAt), {
                        locale: de,
                        addSuffix: true,
                      })}
                    </time>
                  )}
                  {lastUpdated && (
                    <div className="flex items-center space-x-2">
                      <time className="text-gray text-xs">
                        Acktualisiert{" "}
                        {formatDistanceToNow(parseISO(lastUpdated), {
                          locale: de,
                          addSuffix: true,
                        })}
                      </time>
                      {a ? <DeliveryStatus a={a} /> : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <div className={`w-full ${targetName?.length < 114 && "flex gap-1"}`}>
            <div className="flex flex-row gap-2 w-full">
              <div>{ImageRenderer(prefixLink(targetImg, s))}</div>
              <div className="flex flex-col w-full">
                <div>
                  {isFlip ? (
                    <>
                      <span className="font-semibold">Amazon Flip: </span>
                      <Tooltip
                        color={"#11848d"}
                        destroyTooltipOnHide
                        title="Angebotspreis möglicherweise unter 'Andere Verkäufer bei Amazon'"
                      >
                        {LinkWrapper(targetLink, targetName)}
                      </Tooltip>
                    </>
                  ) : (
                    <>{LinkWrapper(targetLink, targetName)}</>
                  )}
                </div>
                {targetUpdatedAt ? (
                  <time className="ml-auto mt-auto text-gray text-xs">
                    {formatDistanceToNow(parseISO(targetUpdatedAt), {
                      locale: de,
                      addSuffix: true,
                    })}
                  </time>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {target === "a" &&
          RetrieveAsin(targetLink, product, userRoles, target, pagination)}
        {target === "e" &&
          RetrieveEsin(targetLink, product, userRoles, target, pagination)}
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
        ) : null}
        {target === "a" && bsr && bsr.length && bsr[0]?.number !== 0 ? (
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
            {aznCategory && (
              <>
                <span className="font-semibold">Kategorie:</span>
                <span className="mx-1" key={aznCategory.label + asin}>
                  {aznCategory.label}
                </span>
              </>
            )}
          </div>
        ) : null}
        {target === "a" ? (
          <div className="flex flex-row gap-2">
            {monthlySold ? (
              <Tooltip
                title={`${
                  monthlySoldSource === "keepa" || lastMonthlySold
                    ? "Die Metrik 'Gekauft im letzten Monat', welche auf den Amazon-Suchergebnisseiten zu finden ist."
                    : "Geschätzte Verkäufe basierend auf dem BSR der Hauptkategorie."
                }`}
              >
                <span>
                  <span className="font-semibold">Monatliche Sales:</span>
                  <span className="text-md">
                    {" "}
                    {monthlySold}{" "}
                    <span className="text-gray text-xs">
                      {" "}
                      ({monthlySoldSource === "keepa" || lastMonthlySold
                        ? "Keepa"
                        : "Geschätzt"})
                    </span>{" "}
                    {lastMonthlySoldUpdatedAt ? (
                      <span className="text-gray text-xs">
                        Aktualisiert {lastMonthlySoldUpdatedAt}
                      </span>
                    ) : null}
                  </span>
                </span>
              </Tooltip>
            ) : null}
            <span>
              <span className="font-semibold">Keepa Drops (30):</span>
              <span className="text-md"> {drops30 ? drops30 : 0}</span>
            </span>
            <span>
              <span className="font-semibold">Keepa Drops (90):</span>
              <span className="text-md"> {drops90 ? drops90 : 0}</span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfoField;
