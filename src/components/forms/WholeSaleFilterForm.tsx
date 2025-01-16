"use client";
import React, { useEffect, useRef, useState } from "react";
import ShowProductsWithBsr from "./productFilterFields/ShowProductsWithBsr";
import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import MinMarginPct from "./productFilterFields/MinMarginPct";
import MinMargin from "./productFilterFields/MinMargin";
import Bsr from "./productFilterFields/Bsr";
import MonthlySales from "./productFilterFields/MonthlySales";
import MaxOfferCount from "./productFilterFields/MaxOfferCount";
import BuyBox from "./productFilterFields/BuyBox";
import { SubmitButton } from "../FormSubmitBn";
import { useUserSettings } from "@/hooks/use-settings";

const WholeSaleFilterForm = ({ target }: { target: string }) => {
  const [settings, setUserSettings] = useUserSettings();
  const layout = "slim";
  const [form] = useForm();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAmazon = target === "a";
  const onFinish = (values: any) => {
    setIsSubmitting(true);
    setUserSettings({ ...settings, ...values });
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };
  useEffect(() => {
    if (formRef.current) {
      form.resetFields();
    }
  }, [settings, form]);

  return (
    <>
      <Form
        ref={formRef}
        form={form}
        className="!ml-auto"
        initialValues={settings}
        onFinish={onFinish}
      >
        <div className="grid grid-cols-8 gap-1">
          {/* Minimale Marge % */}
          <MinMarginPct layout={layout} />
          {/* Minimale Marge € */}
          <MinMargin layout={layout} />
          {isAmazon ? (
            <>
              {/* BSR */}
              <Bsr layout={layout} />
              {/* Minimale monatliche Verkäufe */}
              <MonthlySales layout={layout} />
              {/* Maximale Offer */}
              <MaxOfferCount layout={layout} />
              {/* BuyBox */}
              <BuyBox layout={layout} />
            </>
          ) : null}

          <div className="col-span-2 mt-auto">
            <SubmitButton text="Speichern" isSubmitting={isSubmitting} />
          </div>
        </div>
      </Form>
    </>
  );
};

export default WholeSaleFilterForm;
