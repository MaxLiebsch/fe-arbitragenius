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
      content={
        <div className="w-[870px] h-[500px]">
          <KeepaGraph product={product} open={open} />
        </div>
      }
    >
      {open ? (
        <div className="cursor-pointer font-semibold">Graph offen</div>
      ) : (
        <Tooltip
          color={"#11848d"}
          destroyTooltipOnHide
          title="Detailierte Graphenansicht"
        >
          <div className="hover:cursor-pointer hover:font-semibold h-14">
            <KeepaGraph open={open} product={product} />
          </div>
        </Tooltip>
      )}
    </Popover>
  );
};

export default KeepaGraphPopover;
