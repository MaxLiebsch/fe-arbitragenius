import { ProductPagination } from "@/hooks/use-products";
import { ModifiedProduct } from "@/types/Product";
import { parseAsinFromUrl } from "@/util/parseAsin";
import React from "react";
import AdminAznCorrectionForm from "../forms/AdminAznCorrectionForm";
import CopyToClipboard from "../CopyToClipboard";

const RetrieveAsin = (
  url: string,
  product: ModifiedProduct,
  userRoles: string[],
  target: string,
  pagination: ProductPagination
) => {
  const { buyBoxIsAmazon, totalOfferCount, eanList, a_rating, a_reviewcnt } =
    product;
  const asin = (product.asin ?? parseAsinFromUrl(url)) || parseAsinFromUrl(url);
  const isAdmin = userRoles.includes("admin");

  if (asin) {
    return (
      <div>
        {isAdmin && (
          <AdminAznCorrectionForm
            product={product}
            pagination={pagination}
            target={target}
            url={url}
          />
        )}
        <div className="flex flex-row gap-1">
          {eanList && eanList.length ? (
            <div className="flex flex-row gap-1">
              <span className="font-semibold">EAN:</span>
              <div className="flex flex-row gap-2">
                {eanList.map((ean: string) => (
                  <CopyToClipboard key={ean} text={ean} />
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            <span className="font-semibold">ASIN: </span>
            <CopyToClipboard text={asin} />
          </div>
        </div>
        {buyBoxIsAmazon !== undefined && (
          <span>
            {buyBoxIsAmazon ? (
              <span>
                <span className="font-semibold"> BuyBox:</span>
                <span className="text-amazon"> Amazon</span>
              </span>
            ) : (
              <span>
                <span className="font-semibold"> BuyBox:</span>
                <span className="text-green-600 font-medium"> Seller</span>
              </span>
            )}
          </span>
        )}
        {totalOfferCount !== undefined && (
          <span>
            <span>
              <span className="font-semibold"> Seller:</span>
              {totalOfferCount ? (
                <span className=""> {totalOfferCount}</span>
              ) : (
                "0"
              )}
            </span>
          </span>
        )}
        {a_rating && a_reviewcnt && (
          <span className='ml-1'>
            <span className="font-semibold">Rating:{" "}</span>
            <span>
              {a_rating} ({a_reviewcnt})
            </span>
          </span>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

export default RetrieveAsin;
