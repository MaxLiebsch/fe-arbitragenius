import { ModifiedProduct } from "@/types/Product";
import { Popover, Tooltip } from "antd";
import React from "react";
import ContentMarge from "./ContentMarge";
import ContentEbyMarge from "./ContentEbyMarge";
import { Settings } from "@/types/Settings";
import { mrgnFieldName } from "@/util/productQueries/mrgnProps";
import { formatCurrency } from "@/util/formatter";

interface MarginPopoverProps {
  product: ModifiedProduct;
  target: string;
  settings: Settings;
}

const MarginPopover = ({ product, target, settings }: MarginPopoverProps) => {
  const [open, setOpen] = React.useState(false);
  const { costs } = product;
  const margin =
    product[mrgnFieldName(target, settings.euProgram) as keyof ModifiedProduct];
  return (
    <Popover
      placement="left"
      arrow={false}
      onOpenChange={setOpen}
      trigger="click"
      overlayInnerStyle={{ pointerEvents: "auto" }}
      content={
        costs && target === "a" ? (
          <ContentMarge product={product} />
        ) : (
          <ContentEbyMarge product={product} />
        )
      }
      title="Margenberechnung"
    >
      <Tooltip
        color={"#11848d"}
        destroyTooltipOnHide
        title="Detailierte Margenberechnungen"
      >
        <div
          className={`flex flex-col hover:font-semibold ${
            open ? "font-semibold" : ""
          }`}
        >
          <div>{formatCurrency(margin)}</div>
        </div>
      </Tooltip>
    </Popover>
  );
};

export default MarginPopover;
