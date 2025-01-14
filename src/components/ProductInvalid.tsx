import { usePaginationAndSort } from "@/hooks/use-pagination";
import { useProductInvalid } from "@/hooks/use-productInvalid";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import { Checkbox, Tooltip } from "antd";
import { set } from "date-fns";
import React from "react";

const ProductInvalid = ({
  target,
  domain,
  productId,
}: {
  target: string;
  domain: string;
  productId: string;
}) => {
  const [paginationModel, setPaginationModel, sortModel, setSortModel] =
    usePaginationAndSort();
  const productInvalid = useProductInvalid({
    target,
    domain,
    pagination: paginationModel,
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
