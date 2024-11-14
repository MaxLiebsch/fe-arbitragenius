import { ProductPagination } from "@/hooks/use-products";
import { ModifiedProduct } from "@/types/Product";
import { parseEsinFromUrl } from "@/util/parseEsin";
import React from "react";
import AdminEbyCorrectionForm from "../forms/AdminEbyCorrectionForm";
import CopyToClipboard from "../CopyToClipboard";

const RetrieveEsin = (
  url: string,
  product: ModifiedProduct,
  userRoles: string[],
  target: string,
  pagination: ProductPagination
) => {
  const { eanList, e_totalOfferCount } = product;
  const esin = (product.esin ?? parseEsinFromUrl(url)) || parseEsinFromUrl(url);
  const isAdmin = userRoles.includes("admin");

  if (esin) {
    return (
      <div>
        {isAdmin && (
          <AdminEbyCorrectionForm
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
            <span className="font-semibold">ESIN: </span>
            <CopyToClipboard text={esin} />
          </div>
          <div>
            {e_totalOfferCount && (
              <span>
                <span>
                  <span className="font-semibold"> Listings:</span>
                  {e_totalOfferCount ? (
                    <span className=""> {e_totalOfferCount}</span>
                  ) : (
                    "0"
                  )}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default RetrieveEsin;
