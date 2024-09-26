import { useUserSettings } from "@/hooks/use-settings";
import { Layout } from "@/types/IProductFilterForm";
import { Form, InputNumber } from "antd";
import React from "react";

const MinMarginPct = ({ layout }: { layout: Layout }) => {
  const [settings] = useUserSettings();
  
  return (
    <div className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}>
      <label
        htmlFor="name"
        className="block text-sm font-medium leading-6 text-secondary-950"
      >
        Minimale Marge % ({settings.netto ? "Netto" : "Brutto"})
      </label>
      <div className="mt-2">
        <Form.Item
          style={{ marginBottom: "0px" }}
          name="minPercentageMargin"
          rules={[
            {
              validator: (_, value) => {
                if (value === 0 || value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Positive Zahl zwischen 0 und 150")
                );
              },
            },
          ]}
        >
          <InputNumber
            name="minPercentageMargin"
            step={1}
            id="minPercentageMargin"
            min={0}
            style={{ width: "100%" }}
            max={150}
            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default MinMarginPct;
