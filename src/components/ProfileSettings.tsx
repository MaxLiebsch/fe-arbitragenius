import React, { useEffect, useRef } from "react";
import { SubmitButton } from "./FormSubmitBn";
import { useFormState } from "react-dom";
import { Checkbox, Form, Slider, Switch } from "antd";
import { updateSettingsAction } from "@/server/actions/update-settings";
import { useQueryClient } from "@tanstack/react-query";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";

const ProfileSettings = ({ prefs }: any) => {
  const [updateSettingsState, updateNameFormAction] = useFormState(
    updateSettingsAction,
    {
      message: "",
      fieldErrors: {},
      error: "",
    }
  );
  let productFilterSettings = defaultProductFilterSettings;

  if (prefs?.settings) {
    productFilterSettings = JSON.parse(prefs.settings);
  }

  console.log("productFilterSettings:", productFilterSettings);
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

  const updateProductfilterSettingsFormRef = useRef<HTMLFormElement>(null);
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-secondary-950">
          Produktfilter
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Hier kannst Du die Filtereinstellungen für die Produkte anpassen.
        </p>
      </div>

      <Form
        className="md:col-span-2"
        initialValues={productFilterSettings}
        onFinish={updateNameFormAction}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-7xl sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Minimale Marge %
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
          <div className="sm:col-span-3">
            <label
              htmlFor="minMargin"
              className="block text-sm font-medium leading-6 text-secondary-950"
            >
              Minimale Marge €
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
          <div className="sm:col-span-6">
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
          {/* BSR */}
          <div className="sm:col-span-6">
            <h2 className="text-base font-semibold leading-7 text-secondary-950">
              BSR (Amazon Bestseller Rang)
            </h2>
            <div className="relative flex items-start">
              <div className="flex flex-row items-center justify-center">
                <Form.Item valuePropName="checked" name="productsWithNoBsr">
                  {/* <input
                    aria-describedby="productsWithNoBsr-description"
                    type="checkbox"
                    className="bg-secondary-600 rounded border-gray-300 text-secondary-950 focus:ring-secondary-500"
                  /> */}
                  <Checkbox className="rounded border-gray-300 text-secondary-950 focus:ring-secondary-500">Produkte ohne BSR anzeigen</Checkbox>
                </Form.Item>
               
              </div>
            </div>
          </div>
          <div className="sm:col-span-3">
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
          <div className="sm:col-span-3">
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
        </div>
        {Boolean(updateSettingsState?.error) && (
          <div className="text-sm text-red-500 text-right">
            ✗ {updateSettingsState?.error}
          </div>
        )}
        {Boolean(updateSettingsState?.message) && (
          <div className="text-sm text-green-500 text-right">
            ✓ {updateSettingsState?.message}
          </div>
        )}

        <div className="mt-8 flex">
          <SubmitButton text="Speichern" />
        </div>
      </Form>
    </div>
  );
};

export default ProfileSettings;
