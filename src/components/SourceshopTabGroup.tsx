import { useUserSettings } from "@/hooks/use-settings";
import { useTargetShop } from "@/hooks/use-targetShop";
import React, { ReactNode, use, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { useSearchParams } from "next/navigation";

const targets = [
  { name: "Amazon", domain: "amazon.de" },
  { name: "Ebay", domain: "ebay.de" },
  { name: "Kaufland (soon)", domain: "kaufland.de" },
];

const SourceshopTabGroup = ({ children }: { children: ReactNode }) => {
  const [selectedIndex, setSelectedIndex] = useTargetShop();
  const [userSettings] = useUserSettings();
  const serachParams = useSearchParams();
  useEffect(() => {
    const target = serachParams.get("target");
    if (target) {
      setSelectedIndex(
        targets.findIndex((item) => item.domain.includes(target))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serachParams]);

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="flex min-w-full flex-none gap-x-6 text-lg font-semibold leading-2 text-gray-400 pb-2">
        {targets.map((item) => {
          const targetDisabled =
            userSettings.loaded &&
            !userSettings.targetPlatforms.includes(item.domain.slice(0, 1));
          return (
            <Tab key={item.name} disabled={targetDisabled}>
              {({ selected }) => (
                <div
                  key={item.name}
                  className={selected ? "text-gray-dark" : ""}
                >
                  {item.name}
                </div>
              )}
            </Tab>
          );
        })}
      </Tab.List>
      {children}
    </Tab.Group>
  );
};

export default SourceshopTabGroup;
