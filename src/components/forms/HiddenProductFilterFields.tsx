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
       {/* Azn Standard Transport  */}
      <Form.Item name="a_tptStandard" hidden></Form.Item>
      {/*Azn Prepcenter */}
      <Form.Item name="a_prepCenter" hidden></Form.Item>
      {/* Azn Transport */}
      <Form.Item name="a_tptSmall" hidden></Form.Item>
      <Form.Item name="a_tptMiddle" hidden></Form.Item>
      <Form.Item name="a_tptLarge" hidden></Form.Item>
      {/* Azn Storage */}
      <Form.Item name="a_strg" hidden></Form.Item>

      {/* Eby Transport */}
      <Form.Item name="tptSmall" hidden></Form.Item>
      <Form.Item name="tptMiddle" hidden></Form.Item>
      <Form.Item name="tptLarge" hidden></Form.Item>
      
      {/* Eby Storage */}
      <Form.Item name="strg" hidden></Form.Item>
       {/*Eby Prepcenter */}
       <Form.Item name="e_prepCenter" hidden></Form.Item>
    </>
  );
};

export default HiddenProductFilterFields;
