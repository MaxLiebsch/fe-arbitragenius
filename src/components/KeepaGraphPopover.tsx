import { Popover, Tooltip } from "antd";
import React from "react";
import { KeepaGraph } from "./KeepaGraph";
import { ModifiedProduct } from "@/types/Product";

const KeepaGraphPopover = ({ product }: { product: ModifiedProduct }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover
      placement="left"
      arrow={false}
      destroyTooltipOnHide
      onOpenChange={setOpen}
      trigger="click"
      overlayInnerStyle={{ pointerEvents: "auto" }}
      content={<KeepaGraph product={product} open={open} />}
    >
      {open ? (
        <div className="cursor-pointer font-semibold">Graph offen</div>
      ) : (
        <Tooltip
          color={"#11848d"}
          destroyTooltipOnHide
          title="Detailierte Graphenansicht"
        >
          <div className="hover:cursor-pointer hover:font-semibold">
            <KeepaGraph open={open} product={product} />
          </div>
        </Tooltip>
      )}
    </Popover>
  );
};

export default KeepaGraphPopover;
