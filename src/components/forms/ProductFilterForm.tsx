"use client";
import React, { useContext, useEffect } from "react";
import { useFormState } from "react-dom";
import { Checkbox, Form, Radio, Select, Switch } from "antd";
import { updateSettingsAction } from "@/server/actions/update-settings";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitButton } from "../FormSubmitBn";
import { Settings } from "@/types/Settings";
import { TotalDealsContext } from "@/context/totalDealsContext";

const ProductFilterForm = ({
  settings,
  layout = "slim",
}: {
  settings: Settings;
  layout?: "slim" | "wide";
}) => {
  const {queryUpdate, setQueryUpdate} = useContext(TotalDealsContext)
  const [updateSettingsState, updateNameFormAction] = useFormState(
    updateSettingsAction,
    {
      message: "",
      fieldErrors: {},
      error: "",
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      if (updateSettingsState?.message) {
        await queryClient.invalidateQueries({
          queryKey: ["preferences"],
          refetchType: "all",
        });
        setQueryUpdate(new Date().getTime())
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["e"],
            refetchType: "all",
          }),
          queryClient.invalidateQueries({
            queryKey: ["a"],
            refetchType: "all",
          }),
        ]);
      }
    })();
  }, [updateSettingsState, queryClient, setQueryUpdate]);

  return (
    <Form
      className="md:col-span-2"
      initialValues={settings}
      onFinish={updateNameFormAction}
    >
      <div
        className={`grid grid-cols-1 ${
          layout === "wide"
            ? "gap-x-6 gap-y-3 sm:grid-cols-6 sm:max-w-7xl"
            : "gap-x-2 gap-y-1 sm:grid-cols-10"
        }`}
      >
        {/* Netto/Brutto */}
        {layout === "wide" && (
          <div
            className={`${
              layout === "wide" ? "sm:col-span-6" : "sm:col-span-1"
            }`}
          >
            <label
              htmlFor="minMargin"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Preise
            </label>
            <div className="mt-2">
              <Form.Item name="netto">
                <Switch checkedChildren="netto" unCheckedChildren="brutto" />
              </Form.Item>
            </div>
          </div>
        )}
        {/* Minimale Marge % */}
        <h2
          className={`${
            layout === "wide" ? "sm:col-span-6" : "hidden"
          }  text-base font-semibold leading-7 text-secondary-950`}
        >
          Amazon
        </h2>
        <div
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            Minimale Marge % ({settings.netto ? "Netto" : "Brutto"})
          </label>
          <div className="mt-2">
            <Form.Item name="minPercentageMargin">
              <input
                type="number"
                name="minPercentageMargin"
                step={1}
                id="minPercentageMargin"
                min={0}
                max={150}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* Minimale Marge € */}
        <div
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <label
            htmlFor="minMargin"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            Minimale Marge € ({settings.netto ? "Netto" : "Brutto"})
          </label>
          <div className="mt-2">
            <Form.Item name="minMargin">
              <input
                type="number"
                name="minMargin"
                id="minMargin"
                step={1}
                min={0}
                max={9999}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* Maximaler Primary BSR */}
        <div
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <label
            htmlFor="maxPrimaryBsr"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            Maximaler BSR Hauptkategorie
          </label>
          <div className="mt-2">
            <Form.Item name="maxPrimaryBsr">
              <input
                type="number"
                step={1}
                name="maxPrimaryBsr"
                id="maxPrimaryBsr"
                min={0}
                max={1000000}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* Maximaler Secondary BSR */}
        <div
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <label
            htmlFor="maxSecondaryBsr"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            Maximaler BSR Nebenkategorie
          </label>
          <div className="mt-2">
            <Form.Item name="maxSecondaryBsr">
              <input
                type="number"
                name="maxSecondaryBsr"
                step={1}
                id="maxSecondaryBsr"
                min={0}
                max={1000000}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* Minimale monatliche Verkäufe */}
        <div
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <label
            htmlFor="monthlySold"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            Minimale monatliche Verkäufe
          </label>
          <div className="mt-2">
            <Form.Item name="monthlySold">
              <input
                type="number"
                name="monthlySold"
                step={1}
                id="monthlySold"
                min={0}
                max={9999}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* Maximale Offer */}
        <div
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <label
            htmlFor="totalOfferCount"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            Maximale Offer
          </label>
          <div className="mt-2">
            <Form.Item name="totalOfferCount">
              <input
                type="number"
                name="totalOfferCount"
                id="totalOfferCount"
                step={1}
                min={0}
                max={9999}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* BuyBox */}
        <div
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <label
            htmlFor="buyBox"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            BuyBox
          </label>
          <div className="mt-2">
            <Form.Item name="buyBox">
              <Select
                id="buyBox"
                style={{ width: "100%" }}
                options={[
                  { value: "amazon", label: "Amazon" },
                  { value: "seller", label: "Seller" },
                  { value: "both", label: "Beide" },
                ]}
              />
            </Form.Item>
          </div>
        </div>
        {/* BSR */}
        <div
          className={`${layout === "wide" ? "sm:col-span-6" : "sm:col-span-2"}`}
        >
          <div className="block text-sm font-medium leading-6 text-secondary-950">
            BSR (Amazon Bestseller Rang)
          </div>
          <div className="relative flex items-start">
            <div className="flex flex-row items-center justify-center mt-2">
              <Form.Item valuePropName="checked" name="productsWithNoBsr">
                <Checkbox className="rounded border-gray-300 pt-4 text-secondary-950 focus:ring-secondary-500">
                  Produkte ohne BSR anzeigen
                </Checkbox>
              </Form.Item>
            </div>
          </div>
        </div>
        <h2
          className={`${
            layout === "wide" ? "sm:col-span-6" : "hidden"
          }  text-base font-semibold leading-7 text-secondary-950`}
        >
          Ebay
        </h2>
        {/* Standard Versandkosten */}
        <div
          className={`${layout === "wide" ? "sm:col-span-6" : "sm:col-span-3"}`}
        >
          <label
            htmlFor="tptStandard"
            className="block text-sm font-medium leading-6 text-secondary-950"
          >
            Standard Ebay Versandkosten
          </label>
          <div className="mt-2">
            <Form.Item name="tptStandard">
              <Radio.Group name="tptStandard" id="tptStandard">
                <Radio value={"tptSmall"}>Versand klein</Radio>
                <Radio value={"tptMiddle"}>Versand mittel</Radio>
                <Radio value={"tptLarge"}>Versand groß</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
        {layout === "wide" && (
          <>
            {/* Versand klein */}
            <div
              className={`${
                layout === "wide" ? "sm:col-span-1" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="tptSmall"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Versand klein €
              </label>
              <div className="mt-2">
                <Form.Item name="tptSmall">
                  <input
                    type="number"
                    name="tptSmall"
                    id="tptSmall"
                    step={0.01}
                    min={0}
                    max={9999}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>
              </div>
            </div>
            {/* Versand mittel */}
            <div
              className={`${
                layout === "wide" ? "sm:col-span-1" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="tptMiddle"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Versand mittel €
              </label>
              <div className="mt-2">
                <Form.Item name="tptMiddle">
                  <input
                    type="number"
                    name="tptMiddle"
                    id="tptMiddle"
                    step={0.01}
                    min={0}
                    max={9999}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>
              </div>
            </div>
            {/* Versand big */}
            <div
              className={`${
                layout === "wide" ? "sm:col-span-1" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="tptLarge"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Versand groß €
              </label>
              <div className="mt-2">
                <Form.Item name="tptLarge">
                  <input
                    type="number"
                    name="tptLarge"
                    id="tptLarge"
                    step={0.01}
                    min={0}
                    max={9999}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>
              </div>
            </div>
            {/* Lagerkosten */}
            <div
              className={`${
                layout === "wide" ? "sm:col-span-1" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="strg"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Lagerkosten €
              </label>
              <div className="mt-2">
                <Form.Item name="strg">
                  <input
                    type="number"
                    name="strg"
                    id="strg"
                    step={0.01}
                    min={0}
                    max={9999}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </Form.Item>
              </div>
            </div>
          </>
        )}
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
            <SubmitButton text="Speichern" />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductFilterForm;
