"use client";
import React, { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Checkbox, Form, Slider, Switch } from "antd";
import { updateSettingsAction } from "@/server/actions/update-settings";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitButton } from "../FormSubmitBn";
import { Settings } from "@/types/Settings";

const ProductFilterForm = ({
  settings,
  layout = "slim",
}: {
  settings: Settings;
  layout?: "slim" | "wide";
}) => {
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
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        await queryClient.invalidateQueries({
          queryKey: ["preferences"],
          refetchType: "all",
        });
        await queryClient.invalidateQueries({
          queryKey: ["shop"],
        });
      }
    })();
  }, [updateSettingsState, queryClient]);

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
            : "gap-x-1 gap-y-1 sm:grid-cols-8"
        }`}
      >
        {/* Minimale Marge % */}
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
                min={0}
                max={9999}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
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
                id="maxSecondaryBsr"
                min={0}
                max={1000000}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* BSR */}
        <div
          className={`${layout === "wide" ? "sm:col-span-6" : "sm:col-span-6"}`}
        >
          <h2 className="text-base font-semibold leading-7 text-secondary-950">
            BSR (Amazon Bestseller Rang)
          </h2>
          <div className="relative flex items-start">
            <div className="flex flex-row items-center justify-center">
              <Form.Item valuePropName="checked" name="productsWithNoBsr">
                <Checkbox className="rounded border-gray-300 text-secondary-950 focus:ring-secondary-500">
                  Produkte ohne BSR anzeigen
                </Checkbox>
              </Form.Item>
            </div>
          </div>
        </div>
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
            <div className="text-sm text-green-500 text-right absolute -top-3 w-full">
              ✓ {updateSettingsState?.message}
            </div>
          )}

          <div className="mt-3 flex ml-auto">
            <SubmitButton text="Speichern" />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductFilterForm;
