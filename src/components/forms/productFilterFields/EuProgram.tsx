import { Layout } from "@/types/IProductFilterForm";
import { Checkbox, Form } from "antd";
import React from "react";

const EuProgram = ({ layout }: { layout: Layout }) => {

  return (
    <div className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}>
      <div className="block text-sm font-medium leading-6 text-secondary-950">
        Teilnahme am Programm Mitteleuropa
      </div>
      <div className="relative flex items-start">
        <div className="flex flex-row items-center justify-center mt-2">
          <Form.Item
            style={{ marginBottom: "0px" }}
            valuePropName="checked"
            name="euProgram"
          >
            <Checkbox className="rounded border-gray-300 pt-4 text-secondary-950 focus:ring-secondary-500">
              Programm Mitteleuropa verwenden
            </Checkbox>
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default EuProgram;
