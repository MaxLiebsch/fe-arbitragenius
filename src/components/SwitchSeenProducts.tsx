import { useUserSettings } from "@/hooks/use-settings";
import { Checkbox } from "antd";
import React from "react";

const SwitchSeenProducts = () => {
  const [settings, setUserSettings] = useUserSettings();
  return (
    <Checkbox
      defaultChecked={Boolean(settings?.showSeen)}
      onChange={(e) => {
        setUserSettings({ ...settings, showSeen: e.target.checked });
      }}
    >
       Zeige gesehene Deals zuerst
    </Checkbox>
  );
};

export default SwitchSeenProducts;
