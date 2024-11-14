import { Layout } from "@/types/IProductFilterForm";
import { Form, Input, InputNumber, Radio } from "antd";
import React from "react";

const EbyTransport = ({ layout }: { layout: Layout }) => {
  return (
    <>
      <div
        className={`${layout === "wide" ? "sm:col-span-6" : "sm:col-span-3"}`}
      >
        <label
          htmlFor="tptStandard"
          className="block text-sm font-medium leading-6 text-secondary-950"
        >
          Standard Ebay Versandkosten
        </label>
        <div className="mt-2">
          <Form.Item style={{ marginBottom: "0px" }} name="tptStandard">
            <Radio.Group name="tptStandard" id="tptStandard">
              <Radio value={"tptSmall"}>Versand klein</Radio>
              <Radio value={"tptMiddle"}>Versand mittel</Radio>
              <Radio value={"tptLarge"}>Versand groß</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>
      {/* Versandkosten */}
      {layout === "wide" && (
        <>
          {/* Versand klein */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="tptSmall"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Versand klein €
            </label>
            <div className="mt-2">
              <Form.Item
                style={{ marginBottom: "0px" }}
                name="tptSmall"
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
                  name="tptSmall"
                  id="tptSmall"
                  style={{ width: "100%" }}
                  step={0.01}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Versand mittel */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="tptMiddle"
              className="block pre text-sm font-medium leading-6 text-secondary-950"
            >
              Versand mittel €
            </label>
            <div className="mt-2">
              <Form.Item
                style={{ marginBottom: "0px" }}
                name="tptMiddle"
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
                  name="tptMiddle"
                  id="tptMiddle"
                  step={0.01}
                  style={{ width: "100%" }}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Versand big */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="tptLarge"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Versand groß €
            </label>
            <div className="mt-2">
              <Form.Item
                style={{ marginBottom: "0px" }}
                name="tptLarge"
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
                  name="tptLarge"
                  id="tptLarge"
                  step={0.01}
                  style={{ width: "100%" }}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Lagerkosten */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="strg"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Lagerkosten €
            </label>
            <div className="mt-2">
              <Form.Item style={{ marginBottom: "0px" }} name="strg">
                <Input
                  type="number"
                  name="strg"
                  id="strg"
                  step={0.01}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Ebay PrepCenterkosten */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="e_prepCenter"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Prepcenter Kosten €
            </label>
            <div className="mt-2">
              <Form.Item style={{ marginBottom: "0px" }} name="e_prepCenter">
                <Input
                  type="number"
                  name="e_prepCenter"
                  id="e_prepCenter"
                  step={0.01}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EbyTransport;
