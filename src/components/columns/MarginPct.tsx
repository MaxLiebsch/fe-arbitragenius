import { Settings } from "@/types/Settings";
import { appendPercentage } from "@/util/formatter";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";
import { GridColDef } from "@mui/x-data-grid-premium";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { mrgnFieldName, mrgnPctFieldName } from "@/util/productQueries/mrgnProps";

const MarginPct = ({
  target,
  flip,
  settings,
}: {
  target: string;
  flip?: boolean;
  settings: Settings;
}): GridColDef<any> => {
  return {
    field: mrgnPctFieldName(target, settings.euProgram),
    headerAlign: "left",
    width: 140,
    headerName: "Marge %",
    renderHeader: (params) => (
      <div className="relative flex flex-col !leading-tight ">
        <span>Marge %</span>
        <span>{`(ROI)`}</span>
      </div>
    ),
    renderCell: (params) => {
      const { row: product } = params;
      const { prc,a_prc, tax, a_useCurrPrice,shop } = product;
      const price  = flip ? a_prc : prc;
      const netPrice = price / (1 + (tax ? tax : 19) / 100);
      const isFlip = shop === "flip";
      const margin = product[mrgnFieldName(target, settings.euProgram)];
      return (
        <div className="flex flex-col">
          {a_useCurrPrice === false && !flip && !isFlip ? (
            <div className="flex flex-row gap-1 items-center justify-center text-amber-600">
              <span>
                <ExclamationTriangleIcon className="h-6 w-6" />
              </span>
              <span>Basierend auf Ø-Preis</span>
            </div>
          ) : null}
          <div>{appendPercentage(params.value)}</div>
          {margin && (
            <div>{`(${roundToTwoDecimals((margin / netPrice) * 100)}%)`}</div>
          )}
        </div>
      );
    },
  };
};

export default MarginPct;
