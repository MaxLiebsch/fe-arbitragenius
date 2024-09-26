import { Layout } from "@/types/IProductFilterForm";
import {  Form, Select } from "antd";
import React from "react";

const BuyBox = ({ layout }: { layout: Layout }) => {
  return (
    <div className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}>
      <label
        htmlFor="buyBox"
        className="block text-sm font-medium leading-6 text-secondary-950"
      >
        BuyBox
      </label>
      <div className="mt-2">
        <Form.Item style={{ marginBottom: "0px" }} name="buyBox">
          <Select
            id="buyBox"
            style={{ width: "100%" }}
            options={[
              { value: "amazon", label: "Amazon" },
              { value: "seller", label: "Seller" },
              { value: "both", label: "Beide" },
            ]}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default BuyBox;
