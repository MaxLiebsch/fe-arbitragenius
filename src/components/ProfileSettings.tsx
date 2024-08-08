import React, { useEffect, useRef } from "react";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";
import ProductFilterForm from "./forms/ProductFilterForm";

const ProfileSettings = ({ prefs }: any) => {

  let settings = defaultProductFilterSettings;

  if (prefs?.settings) {
    settings = {
      ...defaultProductFilterSettings,
      ...JSON.parse(prefs.settings),
    };
  }
 

  

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-secondary-950">
          Produktfilter
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Hier kannst Du die Filtereinstellungen für die Produkte anpassen.
        </p>
      </div>
      <ProductFilterForm layout="wide" settings={settings} />
    </div>
  );
};

export default ProfileSettings;
