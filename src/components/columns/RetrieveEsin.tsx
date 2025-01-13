import { ProductPagination } from "@/hooks/use-products";
import { ModifiedProduct } from "@/types/Product";
import { parseEsinFromUrl } from "@/util/parseEsin";
import React from "react";
import AdminEbyCorrectionForm from "../forms/AdminEbyCorrectionForm";
import CopyToClipboard from "../CopyToClipboard";
import Eanlist from "../Eanlist";

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
          <Eanlist eanList={eanList} />
          <div>
            <span className="font-semibold">ESIN: </span>
            <CopyToClipboard text={esin} />
          </div>
          <div>
            {e_totalOfferCount && (
              <span>
                <span>
                  <span className="font-semibold"> Anzahl der Angebote:</span>
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
