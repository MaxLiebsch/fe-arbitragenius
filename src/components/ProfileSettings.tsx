import React, { useEffect, useRef } from "react";
import { SubmitButton } from "./FormSubmitBn";
import { useFormState } from "react-dom";
import { Form, Slider, Switch } from "antd";
import { updateSettingsAction } from "@/server/actions/update-settings";
import { useQueryClient } from "@tanstack/react-query";

const ProfileSettings = ({ prefs }: any) => {
  const [updateSettingsState, updateNameFormAction] = useFormState(
    updateSettingsAction,
    {
      message: "",
      fieldErrors: {},
      error: "",
    }
  );
  let productFilterSettings = {
    minMargin: 0,
    minPercentageMargin: 0,
    netto: true,
  };
  if (prefs?.settings) {
    productFilterSettings = JSON.parse(prefs.settings);
  }
  const queryClient = useQueryClient();

  useEffect(() => {
  (async () => {
    if(updateSettingsState?.message) {
      await queryClient.invalidateQueries({queryKey: ['user']})
      await queryClient.invalidateQueries({queryKey: ['preferences'], refetchType: "all"})
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

      <Form className="md:col-span-2"
      
      initialValues={productFilterSettings}
      onFinish={updateNameFormAction}>
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
                <Slider
                  min={0}
                  tooltip={{open: true, placement: "bottom"}}
                  max={150}
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
                <Slider
                  tooltip={{open: true, placement: "bottom"}}
                  min={0}
                  max={9999}
                  />
              </Form.Item>
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="minMargin"
              className="block text-sm font-medium leading-6 text-secondary-950"
              >
              Preise
            </label>
            <div className="mt-2">
              <Form.Item name="netto">
                <Switch
                  defaultChecked
                  checkedChildren="netto"
                  unCheckedChildren="brutto"
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
