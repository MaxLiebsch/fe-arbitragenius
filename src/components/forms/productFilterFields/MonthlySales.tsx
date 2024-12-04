import { Layout } from "@/types/IProductFilterForm";
import {  Form, InputNumber } from "antd";
import React from "react";

const MonthlySales = ({ layout }: { layout: Layout }) => {
  return (
    <div className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}>
      <label
        htmlFor="monthlySold"
        className="block text-sm font-medium leading-6 text-secondary"
      >
        Minimale monatliche Verkäufe
      </label>
      <div className="mt-2">
        <Form.Item
          style={{ marginBottom: "0px" }}
          name="monthlySold"
          rules={[
            {
              validator: (_, value) => {
                if (value === 0 || value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Positive Zahl zwischen 0 und 9999")
                );
              },
            },
          ]}
        >
          <InputNumber
            type="number"
            name="monthlySold"
            step={1}
            style={{ width: "100%" }}
            id="monthlySold"
            min={0}
            max={9999}
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default MonthlySales;
