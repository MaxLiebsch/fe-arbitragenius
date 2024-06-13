import React, { useEffect, useRef } from "react";
import { SubmitButton } from "./FormSubmitBn";
import { useFormState } from "react-dom";
import { Checkbox, Form, Slider, Switch } from "antd";
import { updateSettingsAction } from "@/server/actions/update-settings";
import { useQueryClient } from "@tanstack/react-query";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";
import ProductFilterForm from "./forms/ProductFilterForm";

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
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      if (updateSettingsState?.message) {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        await queryClient.invalidateQueries({
          queryKey: ["preferences"],
          refetchType: "all",
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["e"],
          }),
          queryClient.invalidateQueries({
            queryKey: ["a"],
          }),
        ]);
      }
    })();
  }, [updateSettingsState, queryClient]);

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

      <ProductFilterForm layout="wide" settings={productFilterSettings} /> 
    </div>
  );
};

export default ProfileSettings;
