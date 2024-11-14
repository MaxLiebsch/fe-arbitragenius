import { Layout } from "@/types/IProductFilterForm";
import { Checkbox, Form, InputNumber } from "antd";
import React from "react";

const Bsr = ({ layout }: { layout: Layout }) => {
  return (
    <>
      {/* Maximialer BSR */}
      <div
        className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
      >
        <label
          htmlFor="maxPrimaryBsr"
          className="block text-sm font-medium leading-6 text-secondary-950"
        >
          Maximaler BSR 
        </label>
        <div className="mt-2">
          <Form.Item
            style={{ marginBottom: "0px" }}
            name="maxPrimaryBsr"
            rules={[
              {
                validator: (_, value) => {
                  if (value === 0 || value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Positive Zahl zwischen 0 und 1.000.000")
                  );
                },
              },
            ]}
          >
            <InputNumber
              type="number"
              step={1}
              name="maxPrimaryBsr"
              id="maxPrimaryBsr"
              style={{ width: "100%" }}
              min={0}
              max={1000000}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            />
          </Form.Item>
        </div>
      </div> 
    </>
  );
};

export default Bsr;
