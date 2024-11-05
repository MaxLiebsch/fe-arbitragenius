import useProductUpdate from "@/hooks/use-product-update";
import { ProductPagination } from "@/hooks/use-products";
import { ModifiedProduct } from "@/types/Product";
import { ProductUpdate } from "@/types/ProductUpdate";
import { parseEsinFromUrl } from "@/util/parseEsin";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input, InputNumber, Switch, Tooltip } from "antd";
import React from "react";
import SharedFields, { EanAndSourceCorrect } from "./SharedFields";
import { useParams } from "next/navigation";
import ScoreAndMatch from "../ScoreAndMatch";

const AdminEbyCorrectionForm = ({
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
  const { qty, e_qty, asin, a_qty, e_vrfd } = product;
  const params = useParams();
  const { domain } = params;
  const esin = (product.esin ?? parseEsinFromUrl(url)) || parseEsinFromUrl(url);
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
        esin,
        originalEsin: esin,
        eTargetCorrect: true,
        aTargetCorrect: true,
        asin: asin || "not available",
        originalAsin: asin || "not available",
        eanCorrect: true,
        qty,
        sourceOutdated: false,
        originalQty: qty,
        e_qty,
        originalEQty: e_qty,
        a_qty: a_qty || 0,
        originalAQty: a_qty || 0,
      }}
    >
      <div className="flex flex-col gap-1 my-2 relative">
        <ScoreAndMatch vrfd={e_vrfd} nmV={product.nm_v} qtyV={product.qty_v} />
        <div className="absolute top-0 right-0">
          <Form.Item
            shouldUpdate
            style={{
              padding: "0px",
              margin: "0px",
              marginLeft: "auto",
            }}
          >
            {() => (
              <Tooltip title="Speichern">
                <Button
                  disabled={updateProduct.isPending}
                  type="primary"
                  className="z-50"
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
          <SharedFields target={target} />
          {/* Target listing correct */}
          <Form.Item
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
              width: "130px",
            }}
            label="Ziel korrekt?"
            name="eTargetCorrect"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          {/* ESIN */}
          <Form.Item
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
              width: "210px",
            }}
            name="esin"
            rules={[
              { required: false, message: "Esin benötigt" },
              {
                pattern: /[A-Za-z0-9]{12}/g,
                message: "Esin: 12 Zeichen",
              },
            ]}
          >
            <Input
              prefix={"ESIN: "}
              addonAfter={
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  onClick={() => form.setFieldValue("esin", esin)}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            style={{
              height: "32px",
              padding: "0px",
              margin: "0px",
              width: "50%",
            }}
            name="e_qty"
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
              prefix={"Eby Qty: "}
              addonAfter={
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  onClick={() => form.setFieldValue("e_qty", e_qty)}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                </Button>
              }
            />
          </Form.Item>
        </div>
        <div className="flex flex-row gap-2">
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

export default AdminEbyCorrectionForm;
