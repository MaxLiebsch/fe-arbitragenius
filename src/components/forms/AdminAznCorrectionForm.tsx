import useProductUpdate from "@/hooks/use-product-update";
import { ProductPagination } from "@/hooks/use-products";
import { ModifiedProduct } from "@/types/Product";
import { ProductUpdate } from "@/types/ProductUpdate";
import { parseAsinFromUrl } from "@/util/parseAsin";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input, InputNumber, Switch, Tooltip } from "antd";
import React from "react";
import SharedFields, { EanAndSourceCorrect } from "./SharedFields";
import { useParams } from "next/navigation";

const AdminAznCorrectionForm = ({
  target,
  product,
  pagination,
  url,
}: {
  product: ModifiedProduct;
  pagination: ProductPagination;
  target: string;
  url: string;
}) => {
  const [form] = Form.useForm<ProductUpdate>();
  const updateProduct = useProductUpdate();
  const params = useParams();
  const { domain } = params;
  const { qty, a_qty, esin, e_qty } = product;
  const asin = (product.asin ?? parseAsinFromUrl(url)) || parseAsinFromUrl(url);
  return (
    <Form
      form={form}
      onFinish={(values) => {
        updateProduct.mutate({
          target,
          update: values,
          domain: (domain as string) || "sales",
          productId: product._id,
          pagination,
        });
      }}
      initialValues={{
        asin,
        originalAsin: asin,
        esin: esin || "not available",
        originalEsin: esin || "not available",
        eanCorrect: true,
        qty,
        eTargetCorrect: true,
        aTargetCorrect: true,
        sourceOutdated: false,
        originalQty: qty,
        a_qty,
        originalAQty: a_qty,
        e_qty: e_qty || 0,
        originalEQty: e_qty || 0,
      }}
    >
      <div className="flex flex-col gap-1 my-2 relative">
        <SharedFields target={target} />
        <div className="absolute top-0 right-20">
          <Form.Item
            shouldUpdate
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
              marginLeft: "auto",
              width: "25%",
            }}
          >
            {() => (
              <Tooltip title="Speichern">
                <Button
                  disabled={updateProduct.isPending}
                  type="primary"
                  htmlType="submit"
                >
                  <div className="flex items-center justify-center">
                    Speichern
                  </div>
                </Button>
              </Tooltip>
            )}
          </Form.Item>
        </div>
        <div className="flex flex-row gap-2">
          {/* ASIN */}
          <Form.Item
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
              width: "195px",
            }}
            name="asin"
            rules={[
              { required: false, message: "Asin benötigt" },
              {
                pattern: /[A-Za-z0-9]{10}/g,
                message: "Asin: 10 Zeichen",
              },
            ]}
          >
            <Input
              prefix={"ASIN: "}
              addonAfter={
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  onClick={() => form.setFieldValue("asin", asin)}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                </Button>
              }
            />
          </Form.Item>
          {/* Target listing correct */}
          <Form.Item
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
              width: "130px",
            }}
            label="Ziel korrekt?"
            name="aTargetCorrect"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
              width: "30%",
            }}
            name="a_qty"
            rules={[
              {
                validator: (_, value) => {
                  if (value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Positive Zahl"));
                },
              },
            ]}
          >
            <InputNumber
              prefix={"Azn Qty: "}
              addonAfter={
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  onClick={() => form.setFieldValue("a_qty", a_qty)}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                </Button>
              }
            />
          </Form.Item>
        </div>
        <div className="flex flex-row gap-1">
          <Form.Item
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
            }}
            name="qty"
            rules={[
              {
                validator: (_, value) => {
                  if (value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Positive Zahl"));
                },
              },
            ]}
          >
            <InputNumber
              prefix={"Qty: "}
              addonAfter={
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  onClick={() => form.setFieldValue("qty", qty)}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                </Button>
              }
            />
          </Form.Item>
          <EanAndSourceCorrect />
        </div>
      </div>
    </Form>
  );
};

export default AdminAznCorrectionForm;
