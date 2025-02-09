import { Button, Popover } from "antd";
import React from "react";
import ProductFilterForm from "./forms/ProductFilterForm";

const ProductFilterPopover = () => {
  return (
    <div>
      <div
        style={{
          zIndex: 1000,
          position: "fixed",
          left: 0,
          top: "50%",
          transform: "translateY(-50%) translateX(-31%)",
        }}
      >
        <Popover placement="right" content={<ProductFilterForm />}>
          <Button type="primary" className="-rotate-90">
            Filter
          </Button>
        </Popover>
      </div>
    </div>
  );
};

export default ProductFilterPopover;
