import { Checkbox, Form } from "antd";
import React from "react";

const HiddenProductFilterFields = () => {
  return (
    <>
      <Form.Item name="euProgram" hidden>
        <Checkbox />
      </Form.Item>
      <Form.Item name="fba" hidden>
        <Checkbox />
      </Form.Item>
    </>
  );
};

export default HiddenProductFilterFields;
