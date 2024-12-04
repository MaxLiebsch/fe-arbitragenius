
import { Layout } from "@/types/IProductFilterForm";
import { Form, Switch } from "antd";
import React from "react";

const Netto = ({ layout }: { layout: Layout }) => {

  return (
    <div className={`${layout === "wide" ? "sm:col-span-6" : "sm:col-span-1"}`}>
      <label
        htmlFor="netto"
        className="block text-sm font-medium leading-6 text-secondary"
      >
        <h2
          className={`${
            layout === "wide" ? "sm:col-span-6" : "hidden"
          }  text-base font-semibold leading-7 text-secondary`}
        >
          Preise
        </h2>
      </label>
      <div className="mt-2">
        <Form.Item style={{ marginBottom: "0px" }} name="netto">
          <Switch checkedChildren="netto" unCheckedChildren="brutto" />
        </Form.Item>
      </div>
    </div>
  );
};

export default Netto;
