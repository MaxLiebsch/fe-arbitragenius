import { usePaginationAndSort } from "@/hooks/use-pagination";
import { useProductIrrelevant } from "@/hooks/use-productIrrelevant";
import { useGridApiContext } from "@mui/x-data-grid-premium";
import { Checkbox, Tooltip } from "antd";
import React from "react";

const ProductIrrelevant = ({
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
  const productIrrelevant = useProductIrrelevant({
    target,
    domain,
    pagination: paginationModel,
  });
  const apiRef = useGridApiContext();
  return (
    <Tooltip title="Deal ist nicht relevant">
      <Checkbox
        onChange={async (e) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          apiRef.current.updateRows([{ _id: productId, _action: "delete" }]);
          productIrrelevant.mutate({ productId });
        }}
      >
        Deal irrelevant
      </Checkbox>
    </Tooltip>
  );
};

export default ProductIrrelevant;
