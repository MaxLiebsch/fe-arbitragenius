import { Settings } from "@/types/Settings";
import { appendPercentage } from "@/util/formatter";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";
import { GridColDef } from "@mui/x-data-grid-premium";

const MarginPct = ({
  target,
  settings,
}: {
  target: string;
  settings: Settings;
}): GridColDef<any> => {
  return {
    field: `${target}_mrgn_pct`,
    headerAlign: "left",
    headerName: "Marge %",
    renderHeader: (params) => (
      <div className="relative flex flex-col !leading-tight ">
        <span>Marge %</span>
        <span>{`(ROI)`}</span>
      </div>
    ),
    renderCell: (params) => {
      const { row } = params;
      const netPrice =
        params.row["prc"] / (1 + (row?.tax ? row.tax : 19) / 100);
      const margin = params.row[`${target}_mrgn`];
      return (
        <div className="flex flex-col">
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
