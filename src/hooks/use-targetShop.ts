import { useEffect, useState } from "react";

export const useTargetShop = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const target = searchParams.get("target") || "amazon";
    setSelectedIndex(target === "amazon" ? 0 : 1);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("target", selectedIndex === 0 ? "amazon" : "ebay");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`
    );
  }, [selectedIndex]);

  return [selectedIndex, setSelectedIndex] as const;
};
