import { totalDealsAtom } from "@/atoms/totalDealsAtom";
import { useAtom } from "jotai";

export function useTotalDeals() {
  return useAtom(totalDealsAtom);
}
