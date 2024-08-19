import { Form, Input, InputNumber, Switch } from "antd";
import React from "react";

const SharedFields = ({ target }: { target: string }) => {
  return (
    <>
      {target === "a" ? (
        <>
          <Form.Item name="e_qty" hidden>
            <InputNumber />
          </Form.Item>
          <Form.Item name="esin" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="eTargetCorrect" hidden>
            <Switch />
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item name="aTargetCorrect" hidden>
            <Switch />
          </Form.Item>
          <Form.Item name="asin" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="a_qty" hidden>
            <InputNumber />
          </Form.Item>
        </>
      )}
      <Form.Item name="originalQty" hidden>
        <InputNumber />
      </Form.Item>
      {/* Ebay */}
      <Form.Item name="originalEsin" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="originalEQty" hidden>
        <InputNumber />
      </Form.Item>
      {/* Amazon */}
      <Form.Item name="originalAsin" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="originalAQty" hidden>
        <InputNumber />
      </Form.Item>
    </>
  );
};

export default SharedFields;

export const EanAndSourceCorrect = () => {
  return (
    <div className='flex flex-row gap-4'>
      {/* EAN */}
      <Form.Item
        style={{
          height: "32px",
          padding: "0px",
          margin: "0px",
          width: "130px",
        }}
        label="EAN korrekt?"
        name="eanCorrect"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      {/* Source Listing outdated */}
      <Form.Item
        style={{
          height: "32px",
          padding: "0px",
          margin: "0px",
          width: "170px",
        }}
        label="Herkunft veraltet?"
        name="sourceOutdated"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </div>
  );
};
