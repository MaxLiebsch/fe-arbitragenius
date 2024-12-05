import { useUserSettings } from "@/hooks/use-settings";
import { Layout } from "@/types/IProductFilterForm";
import { Form, InputNumber } from "antd";
import React from "react";

const APrepcenter = ({ layout, isFba }: { layout: Layout; isFba: boolean }) => {
  return (
    /* Azn PrepCenterkosten */
    <div className={`${isFba ? "sm:col-span-3" : "sm:col-span-2"}`}>
      <label
        htmlFor="a_prepCenter"
        className="block text-sm font-medium leading-6 text-secondary"
      >
        Prepcenter Kosten €
      </label>
      <div className="mt-2 ">
        <Form.Item style={{ marginBottom: "0px" }} name="a_prepCenter">
          <InputNumber
            type="number"
            name="a_prepCenter"
            id="a_prepCenter"
            step={0.01}
            min={0}
            max={9999}
            className="block !w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default APrepcenter;
