import { Settings } from "@/types/Settings";
import { appendPercentage } from "@/util/formatter";
import {
  roundToFourDecimals,
  roundToTwoDecimals,
} from "@/util/roundToTwoDecimals";
import { GridColDef } from "@mui/x-data-grid-premium";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  mrgnFieldName,
  mrgnPctFieldName,
} from "@/util/productQueries/mrgnProps";
import { calculateNetPrice } from "@/util/calculateNetPrice";
import { Tooltip } from "antd";

const MarginPct = ({
  target,
  settings,
}: {
  target: string;
  settings: Settings;
}): GridColDef<any> => {
  return {
    field: mrgnPctFieldName(target, settings.euProgram),
    headerAlign: "left",
    width: 140,
    headerName: "Marge %",
    renderHeader: (params) => (
      <div className="relative flex flex-col !leading-tight ">
        <Tooltip title="Marge in % und Return on Investment (Netto)">
          <span>Marge %</span>
          <span>{` (ROI)`}</span>
        </Tooltip>
        <div className="text-xs">
          <span className="text-green-600">
            {settings.netto ? "Netto" : "Brutto"}
          </span>
        </div>
      </div>
    ),
    renderCell: (params) => {
      const { row: product } = params;
      const { prc, a_prc, tax, a_useCurrPrice, shop, a_qty, e_qty, qty } =
        product;
      const isFlip = shop === "flip";
      const price = isFlip ? a_prc : prc;
      const flipQty = isFlip ? a_qty : qty;
      const factor = (target === "a" ? a_qty : e_qty) / flipQty;
      const netPrice = calculateNetPrice(price, tax) * factor;
      const margin = product[mrgnFieldName(target, settings.euProgram)];
      const roi = appendPercentage(
        roundToFourDecimals(margin / netPrice) * 100
      );
      // if (product.asin === "B01K7SHKCK"){
      //   console.log('mrgn field factor:', factor)
      //   console.log('db earnings:', margin)
      //   console.log("margin / netPrice:", margin / netPrice);
      //   console.log("mrgn field roi:", roi);
      // }
      return (
        <div className="flex flex-col">
          {a_useCurrPrice === false && !isFlip ? (
            <div className="flex flex-row gap-1 items-center justify-center text-amber-600">
              <span>
                <ExclamationTriangleIcon className="h-6 w-6" />
              </span>
              <span>Basierend auf Ø-Preis</span>
            </div>
          ) : null}
          <div>{appendPercentage(params.value)}</div>
          {margin && <div>{`(${roi})`}</div>}
        </div>
      );
    },
  };
};

export default MarginPct;
