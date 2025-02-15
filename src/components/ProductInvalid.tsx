import { useProductInvalid } from "@/hooks/use-productInvalid";
import { ProductPagination } from "@/hooks/use-products";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import { Checkbox, Tooltip } from "antd";
import React from "react";

const ProductInvalid = ({
  target,
  domain,
  productId,
  pagination,
}: {
  target: string;
  domain: string;
  productId: string;
  pagination: ProductPagination;
}) => {
  const productInvalid = useProductInvalid({
    target,
    domain,
    pagination,
  });
  const apiRef = useGridApiContext();
  return (
    <Tooltip title="Deal als ungültig markieren">
      <Checkbox
        onChange={async (e) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          apiRef.current.updateRows([{ _id: productId, _action: "delete" }]);
          productInvalid.mutate({ productId });
        }}
      >
        Deal ungültig
      </Checkbox>
    </Tooltip>
  );
};

export default ProductInvalid;
