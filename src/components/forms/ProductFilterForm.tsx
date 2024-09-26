"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { updateSettingsAction } from "@/server/actions/update-settings";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitButton } from "../FormSubmitBn";
import { TotalDealsContext } from "@/context/totalDealsContext";
import { useUserSettings } from "@/hooks/use-settings";
import { Settings } from "@/types/Settings";
import { useForm } from "antd/es/form/Form";
import HiddenProductFilterFields from "./HiddenProductFilterFields";
import { Layout } from "@/types/IProductFilterForm";
import MinMarginPct from "./productFilterFields/MinMarginPct";
import MinMargin from "./productFilterFields/MinMargin";
import Netto from "./productFilterFields/Netto";
import EuProgram from "./productFilterFields/EuProgram";
import Fba from "./productFilterFields/Fba";
import AznTransport from "./productFilterFields/AznTransport";
import Bsr from "./productFilterFields/Bsr";
import MonthlySales from "./productFilterFields/MonthlySales";
import MaxOfferCount from "./productFilterFields/MaxOfferCount";
import BuyBox from "./productFilterFields/BuyBox";
import ShowProductsWithBsr from "./productFilterFields/ShowProductsWithBsr";
import EbyTransport from "./productFilterFields/EbyTransport";
import CategorySelect from "./productFilterFields/CategorySelect";
import Spinner from "../Spinner";

const ProductFilterForm = ({ layout = "slim" }: { layout?: Layout }) => {
  const [settings, setUserSettings] = useUserSettings();
  const { queryUpdate, setQueryUpdate } = useContext(TotalDealsContext);
  const [updateSettingsState, setUpdateSettingsState] = useState<{
    message?: string;
    fieldErrors: {};
    error?: string;
    settings?: Settings;
  }>({
    message: "",
    fieldErrors: {},
    error: "",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      if (updateSettingsState?.message) {
        await queryClient.invalidateQueries({
          queryKey: ["preferences"],
          exact: false,
          refetchType: "all",
        });
        setQueryUpdate(new Date().getTime());
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["e"],
            exact: false,
          }),
          queryClient.invalidateQueries({
            queryKey: ["a"],
            exact: false,
          }),
        ]);
      }
    })();
  }, [updateSettingsState, queryClient, setQueryUpdate]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = useForm();
  const formRef = useRef(null);
  const [isFba, setIsFba] = useState(settings.fba);

  const onFinish = async (values: any) => {
    setUpdateSettingsState({ message: "", fieldErrors: {}, error: "" });
    setIsSubmitting(true); // Set the submission state to true
    try {
      // Simulate an async operation (like an API call)
      const updateSettings = await updateSettingsAction(values);
      const updatedSettings = updateSettings?.settings;
      if (updatedSettings) {
        setUserSettings({...updatedSettings, loaded: true});
      }
      setUpdateSettingsState(updateSettings);
    } finally {
      setIsSubmitting(false); // Reset the submission state
    }
  };
  useEffect(() => {
    if (formRef.current) {
      form.resetFields();
    }
    onValuesChange({ fba: settings.fba });
  }, [settings, form]);

  const onValuesChange = (changedValues: any) => {
    if (changedValues.fba !== undefined) {
      setIsFba(changedValues.fba);
    }
  };

  return (
    <>
      {/* {settings.loaded === false ? (
        <div className="flex items-center justify-center w-full mr-12">
          <Spinner />
        </div>
      ) : ( */}
        <Form
          ref={formRef}
          form={form}
          className="md:col-span-2"
          initialValues={settings}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <div
            className={`grid grid-cols-1 h-full ${
              layout === "wide"
                ? "gap-x-6 gap-y-3 sm:grid-cols-6 sm:max-w-7xl"
                : "gap-x-2 gap-y-1 sm:grid-cols-1"
            }`}
          >
            {/* Hiddenfield */}
            {layout !== "wide" && <HiddenProductFilterFields />}
            {/* Netto/Brutto */}
            {layout === "wide" && <Netto layout={layout} />}
            {/* Minimale Marge % */}
            <MinMarginPct layout={layout} />
            {/* Minimale Marge € */}
            <MinMargin layout={layout} />
            {/* Amazon */}
            <h2
              className={`${
                layout === "wide" ? "sm:col-span-6" : "hidden"
              }  text-base font-semibold leading-7 text-secondary-950`}
            >
              Amazon
            </h2>
            {/* Programm Mitteleuropa */}
            {layout === "wide" && <EuProgram layout={layout} />}
            {/* FBA */}
            {layout === "wide" && (
              <>
                <Fba layout={layout} />
                {/* Azn Standard Versandkosten */}
                {!isFba && <AznTransport layout={layout} />}
              </>
            )}
            {/* Azn Categories */}
            <CategorySelect layout={layout} target="a" />
            {/* BSR */}
            <Bsr layout={layout} />
            {/* Minimale monatliche Verkäufe */}
            <MonthlySales layout={layout} />
            {/* Maximale Offer */}
            <MaxOfferCount layout={layout} />
            {/* BuyBox */}
            <BuyBox layout={layout} />
            {/* BSR */}
            <ShowProductsWithBsr layout={layout} />

            <h2
              className={`${
                layout === "wide" ? "sm:col-span-6" : "hidden"
              }  text-base font-semibold leading-7 text-secondary-950`}
            >
              Ebay
            </h2>
            {/* Eby Categories */}
            <CategorySelect layout={layout} target="e" />
            {/* Eby Standard Versandkosten */}
            <EbyTransport layout={layout} />
            <div
              className={`relative ${
                layout === "wide" ? "sm:col-span-6" : "sm:col-span-2"
              }`}
            >
              {Boolean(updateSettingsState?.error) && (
                <div className="text-sm text-red-500 text-right">
                  ✗ {updateSettingsState?.error}
                </div>
              )}
              {Boolean(updateSettingsState?.message) && (
                <div className="text-sm text-green-500 text-right absolute -top-6 w-full">
                  ✓ {updateSettingsState?.message}
                </div>
              )}

              <div className="flex ml-auto">
                <SubmitButton text="Speichern" isSubmitting={isSubmitting} />
              </div>
            </div>
          </div>
        </Form>
      {/* )} */}
    </>
  );
};

export default ProductFilterForm;
