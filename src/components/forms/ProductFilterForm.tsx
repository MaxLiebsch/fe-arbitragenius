"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
} from "antd";
import { updateSettingsAction } from "@/server/actions/update-settings";
import { useQueryClient } from "@tanstack/react-query";
import { SubmitButton } from "../FormSubmitBn";
import { TotalDealsContext } from "@/context/totalDealsContext";
import { useUserSettings } from "@/hooks/use-settings";
import { Settings } from "@/types/Settings";
import { useForm } from "antd/es/form/Form";
import HiddenProductFilterFields from "./HiddenProductFilterFields";

const ProductFilterForm = ({
  layout = "slim",
}: {
  layout?: "slim" | "wide";
}) => {
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
  const [isFba, setIsFba] = useState(settings.fba);

  const onFinish = async (values: any) => {
    setUpdateSettingsState({ message: "", fieldErrors: {}, error: "" });
    setIsSubmitting(true); // Set the submission state to true
    try {
      // Simulate an async operation (like an API call)
      const updateSettings = await updateSettingsAction(values);
      const updatedSettings = updateSettings?.settings;
      if (updatedSettings) {
        setUserSettings(updatedSettings);
      }
      setUpdateSettingsState(updateSettings);
    } finally {
      setIsSubmitting(false); // Reset the submission state
    }
  };
  useEffect(() => {
    form.resetFields();
    onValuesChange({ fba: settings.fba });
  }, [settings]);
  const onValuesChange = (changedValues: any) => {
    if (changedValues.fba !== undefined) {
      setIsFba(changedValues.fba);
    }
  };

  return (
    <Form
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
              <h2
                className={`${
                  layout === "wide" ? "sm:col-span-6" : "hidden"
                }  text-base font-semibold leading-7 text-secondary-950`}
              >
                Preise
              </h2>
            </label>
            <div className="mt-2">
              <Form.Item style={{ marginBottom: "0px" }} name="netto">
                <Switch checkedChildren="netto" unCheckedChildren="brutto" />
              </Form.Item>
            </div>
          </div>
        )}
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
            <Form.Item
              style={{ marginBottom: "0px" }}
              name="minPercentageMargin"
              rules={[
                {
                  validator: (_, value) => {
                    if (value === 0 || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Positive Zahl zwischen 0 und 150")
                    );
                  },
                },
              ]}
            >
              <InputNumber
                name="minPercentageMargin"
                step={1}
                id="minPercentageMargin"
                min={0}
                style={{ width: "100%" }}
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
            <Form.Item
              style={{ marginBottom: "0px" }}
              name="minMargin"
              rules={[
                {
                  validator: (_, value) => {
                    if (value === 0 || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Positive Zahl zwischen 0 und 9999")
                    );
                  },
                },
              ]}
            >
              <InputNumber
                type="number"
                name="minMargin"
                id="minMargin"
                style={{ width: "100%" }}
                step={1}
                min={0}
                max={9999}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </Form.Item>
          </div>
        </div>
        {/* Amazon */}
        <h2
          className={`${
            layout === "wide" ? "sm:col-span-6" : "hidden"
          }  text-base font-semibold leading-7 text-secondary-950`}
        >
          Amazon
        </h2>
        {/* Programm Mitteleuropa */}
        {layout === "wide" && (
          <div
            className={`${
              layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"
            }`}
          >
            <div className="block text-sm font-medium leading-6 text-secondary-950">
              Teilnahme am Programm Mitteleuropa
            </div>
            <div className="relative flex items-start">
              <div className="flex flex-row items-center justify-center mt-2">
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  valuePropName="checked"
                  name="euProgram"
                >
                  <Checkbox className="rounded border-gray-300 pt-4 text-secondary-950 focus:ring-secondary-500">
                    Programm Mitteleuropa verwenden
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
          </div>
        )}
        {/* FBA */}
        {layout === "wide" && (
          <>
            <div
              className={`${
                layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"
              }`}
            >
              <div className="block text-sm font-medium leading-6 text-secondary-950">
                Versand durch Amazon (FBA)
              </div>
              <div className="relative flex items-start">
                <div className="flex flex-row items-center justify-center mt-2">
                  <Form.Item
                    style={{ marginBottom: "0px" }}
                    valuePropName="checked"
                    name="fba"
                  >
                    <Checkbox className="rounded border-gray-300 pt-4 text-secondary-950 focus:ring-secondary-500">
                      Ich nutze Versand durch Amazon
                    </Checkbox>
                  </Form.Item>
                </div>
              </div>
            </div>
            {/* Azn Standard Versandkosten */}
            {!isFba && (
              <>
                {/* Azn Standard Versandkosten */}
                <div
                  className={`${
                    layout === "wide" ? "sm:col-span-6" : "sm:col-span-3"
                  }`}
                >
                  <label
                    htmlFor="a_tptStandard"
                    className="block text-sm font-medium leading-6 text-secondary-950"
                  >
                    Amazon Versandkosten
                  </label>
                  <div className="mt-2">
                    <Form.Item
                      style={{ marginBottom: "0px" }}
                      name="a_tptStandard"
                    >
                      <Radio.Group name="a_tptStandard" id="a_tptStandard">
                        <Radio value={"a_tptSmall"}>Versand klein</Radio>
                        <Radio value={"a_tptMiddle"}>Versand mittel</Radio>
                        <Radio value={"a_tptLarge"}>Versand groß</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>
                {/* Azn Versandkosten */}
                {layout === "wide" && (
                  <>
                    {/* Azn Versand klein */}
                    <div
                      className={`${
                        layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
                      }`}
                    >
                      <label
                        htmlFor="a_tptSmall"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Versand klein €
                      </label>
                      <div className="mt-2">
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name="a_tptSmall"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (value === 0 || value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("Positive Zahl zwischen 0 und 9999")
                                );
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            type="number"
                            name="a_tptSmall"
                            id="a_tptSmall"
                            style={{ width: "100%" }}
                            step={0.01}
                            min={0}
                            max={9999}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    {/* Azn Versand mittel */}
                    <div
                      className={`${
                        layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
                      }`}
                    >
                      <label
                        htmlFor="a_tptMiddle"
                        className="block pre text-sm font-medium leading-6 text-secondary-950"
                      >
                        Versand mittel €
                      </label>
                      <div className="mt-2">
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name="a_tptMiddle"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (value === 0 || value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("Positive Zahl zwischen 0 und 9999")
                                );
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            type="number"
                            name="a_tptMiddle"
                            id="a_tptMiddle"
                            step={0.01}
                            style={{ width: "100%" }}
                            min={0}
                            max={9999}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    {/* Azn Versand big */}
                    <div
                      className={`${
                        layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
                      }`}
                    >
                      <label
                        htmlFor="a_tptLarge"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Versand groß €
                      </label>
                      <div className="mt-2">
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name="a_tptLarge"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (value === 0 || value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("Positive Zahl zwischen 0 und 9999")
                                );
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            type="number"
                            name="a_tptLarge"
                            id="a_tptLarge"
                            step={0.01}
                            style={{ width: "100%" }}
                            min={0}
                            max={9999}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    {/* Azn Lagerkosten */}
                    <div
                      className={`${
                        layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
                      }`}
                    >
                      <label
                        htmlFor="a_strg"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Lagerkosten €
                      </label>
                      <div className="mt-2">
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name="a_strg"
                        >
                          <Input
                            type="number"
                            name="a_strg"
                            id="a_strg"
                            step={0.01}
                            min={0}
                            max={9999}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    {/* Azn PrepCenterkosten */}
                    <div
                      className={`${
                        layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
                      }`}
                    >
                      <label
                        htmlFor="a_prepCenter"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Prepcenter Kosten €
                      </label>
                      <div className="mt-2">
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name="a_prepCenter"
                        >
                          <Input
                            type="number"
                            name="a_prepCenter"
                            id="a_prepCenter"
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
              </>
            )}
          </>
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
            <Form.Item
              style={{ marginBottom: "0px" }}
              name="maxPrimaryBsr"
              rules={[
                {
                  validator: (_, value) => {
                    if (value === 0 || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Positive Zahl zwischen 0 und 1.000.000")
                    );
                  },
                },
              ]}
            >
              <InputNumber
                type="number"
                step={1}
                name="maxPrimaryBsr"
                id="maxPrimaryBsr"
                style={{ width: "100%" }}
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
            <Form.Item
              style={{ marginBottom: "0px" }}
              name="maxSecondaryBsr"
              rules={[
                {
                  validator: (_, value) => {
                    if (value === 0 || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Positive Zahl zwischen 0 und 1.000.000")
                    );
                  },
                },
              ]}
            >
              <InputNumber
                type="number"
                name="maxSecondaryBsr"
                step={1}
                style={{ width: "100%" }}
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
            <Form.Item
              style={{ marginBottom: "0px" }}
              name="monthlySold"
              rules={[
                {
                  validator: (_, value) => {
                    if (value === 0 || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Positive Zahl zwischen 0 und 9999")
                    );
                  },
                },
              ]}
            >
              <InputNumber
                type="number"
                name="monthlySold"
                step={1}
                style={{ width: "100%" }}
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
          <div className="mt-2 w-full">
            <Form.Item
              style={{ marginBottom: "0px" }}
              name="totalOfferCount"
              rules={[
                {
                  validator: (_, value) => {
                    if (value === 0 || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Positive Zahl zwischen 0 und 9999")
                    );
                  },
                },
              ]}
            >
              <InputNumber
                type="number"
                name="totalOfferCount"
                id="totalOfferCount"
                style={{ width: "100%" }}
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
            <Form.Item style={{ marginBottom: "0px" }} name="buyBox">
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
          className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}
        >
          <div className="block text-sm font-medium leading-6 text-secondary-950">
            BSR (Amazon Bestseller Rang)
          </div>
          <div className="relative flex items-start">
            <div className="flex flex-row items-center justify-center mt-2">
              <Form.Item
                style={{ marginBottom: "0px" }}
                valuePropName="checked"
                name="productsWithNoBsr"
              >
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
            <Form.Item style={{ marginBottom: "0px" }} name="tptStandard">
              <Radio.Group name="tptStandard" id="tptStandard">
                <Radio value={"tptSmall"}>Versand klein</Radio>
                <Radio value={"tptMiddle"}>Versand mittel</Radio>
                <Radio value={"tptLarge"}>Versand groß</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
        {/* Versandkosten */}
        {layout === "wide" && (
          <>
            {/* Versand klein */}
            <div
              className={`${
                layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="tptSmall"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Versand klein €
              </label>
              <div className="mt-2">
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  name="tptSmall"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value === 0 || value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Positive Zahl zwischen 0 und 9999")
                        );
                      },
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    name="tptSmall"
                    id="tptSmall"
                    style={{ width: "100%" }}
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
                layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="tptMiddle"
                className="block pre text-sm font-medium leading-6 text-secondary-950"
              >
                Versand mittel €
              </label>
              <div className="mt-2">
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  name="tptMiddle"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value === 0 || value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Positive Zahl zwischen 0 und 9999")
                        );
                      },
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    name="tptMiddle"
                    id="tptMiddle"
                    step={0.01}
                    style={{ width: "100%" }}
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
                layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="tptLarge"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Versand groß €
              </label>
              <div className="mt-2">
                <Form.Item
                  style={{ marginBottom: "0px" }}
                  name="tptLarge"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value === 0 || value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Positive Zahl zwischen 0 und 9999")
                        );
                      },
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    name="tptLarge"
                    id="tptLarge"
                    step={0.01}
                    style={{ width: "100%" }}
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
                layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="strg"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Lagerkosten €
              </label>
              <div className="mt-2">
                <Form.Item style={{ marginBottom: "0px" }} name="strg">
                  <Input
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
            {/* Ebay PrepCenterkosten */}
            <div
              className={`${
                layout === "wide" ? "sm:col-span-2" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="e_prepCenter"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Prepcenter Kosten €
              </label>
              <div className="mt-2">
                <Form.Item style={{ marginBottom: "0px" }} name="e_prepCenter">
                  <Input
                    type="number"
                    name="e_prepCenter"
                    id="e_prepCenter"
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
            <SubmitButton text="Speichern" isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductFilterForm;
