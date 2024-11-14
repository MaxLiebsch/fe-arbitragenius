import { Layout } from "@/types/IProductFilterForm";
import {  Form, Input, InputNumber, Radio } from "antd";
import React from "react";

const AznTransport = ({ layout }: { layout: Layout }) => {
  return (
    <>
      <div
        className={`${layout === "wide" ? "sm:col-span-6" : "sm:col-span-3"}`}
      >
        <label
          htmlFor="a_tptStandard"
          className="block text-sm font-medium leading-6 text-secondary-950"
        >
          Amazon Versandkosten
        </label>
        <div className="mt-2">
          <Form.Item style={{ marginBottom: "0px" }} name="a_tptStandard">
            <Radio.Group name="a_tptStandard" id="a_tptStandard">
              <Radio value={"a_tptSmall"}>Versand klein</Radio>
              <Radio value={"a_tptMiddle"}>Versand mittel</Radio>
              <Radio value={"a_tptLarge"}>Versand groß</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>
      {/* Azn Versandkosten */}
      {layout === "wide" && (
        <>
          {/* Azn Versand klein */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="a_tptSmall"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Versand klein €
            </label>
            <div className="mt-2">
              <Form.Item
                style={{ marginBottom: "0px" }}
                name="a_tptSmall"
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
                  name="a_tptSmall"
                  id="a_tptSmall"
                  style={{ width: "100%" }}
                  step={0.01}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Azn Versand mittel */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="a_tptMiddle"
              className="block pre text-sm font-medium leading-6 text-secondary-950"
            >
              Versand mittel €
            </label>
            <div className="mt-2">
              <Form.Item
                style={{ marginBottom: "0px" }}
                name="a_tptMiddle"
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
                  name="a_tptMiddle"
                  id="a_tptMiddle"
                  step={0.01}
                  style={{ width: "100%" }}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Azn Versand big */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="a_tptLarge"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Versand groß €
            </label>
            <div className="mt-2">
              <Form.Item
                style={{ marginBottom: "0px" }}
                name="a_tptLarge"
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
                  name="a_tptLarge"
                  id="a_tptLarge"
                  step={0.01}
                  style={{ width: "100%" }}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Azn Lagerkosten */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="a_strg"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Lagerkosten €
            </label>
            <div className="mt-2">
              <Form.Item style={{ marginBottom: "0px" }} name="a_strg">
                <Input
                  type="number"
                  name="a_strg"
                  id="a_strg"
                  step={0.01}
                  min={0}
                  max={9999}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </Form.Item>
            </div>
          </div>
          {/* Azn PrepCenterkosten */}
          <div
            className={`${
              layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
            }`}
          >
            <label
              htmlFor="a_prepCenter"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Prepcenter Kosten €
            </label>
            <div className="mt-2">
              <Form.Item style={{ marginBottom: "0px" }} name="a_prepCenter">
                <Input
                  type="number"
                  name="a_prepCenter"
                  id="a_prepCenter"
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

export default AznTransport;
