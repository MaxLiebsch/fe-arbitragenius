import { Checkbox, Form } from "antd";
import React from "react";

const HiddenProductFilterFields = () => {
  return (
    <>
      <Form.Item name="euProgram" valuePropName="checked" hidden>
        <Checkbox />
      </Form.Item>
      <Form.Item name="fba" valuePropName="checked" hidden>
        <Checkbox />
      </Form.Item>
    </>
  );
};

export default HiddenProductFilterFields;
