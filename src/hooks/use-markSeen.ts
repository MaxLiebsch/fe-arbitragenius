import { CONSIDERED_SEEN_DWELL_DURANTION } from "@/constant/constant";
import { GridApiPremium } from "@mui/x-data-grid-premium/models/gridApiPremium";
import { useEffect, useRef, useState } from "react";
import { useProductSeen } from "./use-productSeen";
import { ProductTableProps } from "@/components/ProductsTable";

export function useMarkSeen(
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: ProductTableProps
) {
  const rowVisted = useRef({
    _id: "",
    enter: new Date().getTime(),
  });
  const [timer, setTimer] = useState<number | null>(null);
  const productSeen = useProductSeen(props);
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.subscribeEvent("rowMouseEnter", (params) => {
        rowVisted.current = {
          _id: params.row._id,
          enter: new Date().getTime(),
        };
        setTimer(CONSIDERED_SEEN_DWELL_DURANTION / 1000); // Set timer in seconds
      });
      apiRef.current.subscribeEvent("rowMouseLeave", (params) => {
        if (
          new Date().getTime() - rowVisted.current.enter >
            CONSIDERED_SEEN_DWELL_DURANTION &&
          !params.row?.seen
        ) {
          productSeen.mutate(params.row._id);
          apiRef.current.updateRows([
            { _id: params.row._id, seen: true, timer: null },
          ]);
        } else {
          apiRef.current.updateRows([{ _id: params.row._id, timer: null }]);
        }
        setTimer(null); // Clear timer on mouse leave
      });
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer !== null && prevTimer > 0) {
          return prevTimer - 1;
        }
        return prevTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef]);

  useEffect(() => {
    if (typeof timer === "number" && timer >= 0) {
      apiRef.current.updateRows([{ _id: rowVisted.current._id, timer }]);
    }
  }, [timer, apiRef]);

}
