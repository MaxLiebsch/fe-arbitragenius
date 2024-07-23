import { keepaTimeSummand } from "@/constant/constant";
import { ModifiedProduct } from "@/types/Product";
import { formatter } from "@/util/formatter";
import { format, fromUnixTime } from "date-fns";
import { de } from "date-fns/locale";
import { parse } from "path";
import { useCallback, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";

type DataPoint = "amazonPrice" | "usedPrice" | "newPrice" | "salesRank";

export const createUnixTimeFromKeepaTime = (timestamp: number) =>
  (timestamp + keepaTimeSummand) * 60;

export const KeepaGraph = ({ product }: { product: ModifiedProduct }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { ahstprcs, anhstprcs, auhstprcs, salesRanks, categoryTree } = product;

  const hasAhstprcs = ahstprcs.length && ahstprcs[1] !== -1;
  const hasAuhstprcs = auhstprcs.length && auhstprcs[1] !== -1;
  const hasAnhstprcs = anhstprcs.length && anhstprcs[1] !== -1;
  const hasSalesRanks = salesRanks && Object.keys(salesRanks).length;

  const parseArray = (array: number[]) => {
    let steps = 8;
    switch (true) {
      case array.length / 2 < 7:
        steps = 2;
        break;
      case array.length / 2 > 400:
        steps = 24;
        break;
    }
    const parsedArray: [number, number][] = [];
    const dates: string[] = [];
    for (let i = 0; i < array.length; i += steps) {
      const unixTimestamp = createUnixTimeFromKeepaTime(array[i]);
      const date = new Date(unixTimestamp * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Months are zero-indexed
      const day = date.getDate();
      const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      if (dates.some((_) => _ === dateStr)) {
        continue;
      } else {
        dates.push(dateStr);
        parsedArray.push([unixTimestamp, array[i + 1]]);
      }
    }
    return parsedArray;
  };

  const parseSalesRank = useCallback(
    (salesRanks: { [key: string]: number[] }) => {
      if (!salesRanks) return {};
      const parsedSalesRank: { [key: string]: number[] } = {};

      if (!categoryTree) return {};

      Object.entries(salesRanks).forEach(([key, value]) => {
        const categoryName = categoryTree.find(
          (category) => category.catId === parseInt(key)
        );
        if (!categoryName) return;
        parsedSalesRank[categoryName.name] = value;
      });
      return parsedSalesRank;
    },
    [categoryTree]
  );

  const combineData = useCallback(
    (
      ahstprcs: number[][],
      auhstprcs: number[][],
      anhstprcs: number[][],
      salesRanks: { [key: string]: number[] }
    ) => {
      const combinedData: {
        date: string;
        epoch: number;
        amazonPrice: number | null;
        usedPrice: number | null;
        newPrice: number | null;
        salesRank: number | null;
      }[] = [];

      const addToCombinedData = (data: number[][], type: DataPoint) => {
        data.forEach((entry, i) => {
          const date = entry[0]
          if (entry[1] === -1) return;

          const value = type !== "salesRank" ? entry[1] / 100 : entry[1];
          const idxExistingData = combinedData.findIndex(
            (data) => data.epoch === date
          );
          if (idxExistingData !== -1) {
            combinedData[idxExistingData][type] = value;
          } else {
            combinedData.push({
              date: format(fromUnixTime(date), "d LLL", { locale: de }),
              epoch: date,
              amazonPrice: null,
              usedPrice: null,
              newPrice: null,
              salesRank: null,
              [type]: value,
            });
          }
        });
      };
      if (ahstprcs.length && ahstprcs[0][1] !== -1) {
        addToCombinedData(ahstprcs, "amazonPrice");
      }
      if (auhstprcs.length && auhstprcs[0][1] !== -1) {
        addToCombinedData(auhstprcs, "usedPrice");
      }
      if (anhstprcs.length && anhstprcs[0][1] !== -1) {
        addToCombinedData(anhstprcs, "newPrice");
      }
      const _salesRanks = Object.entries(salesRanks);

      if (_salesRanks.length) {
        const parsedArray = parseArray(_salesRanks[0][1]);
        addToCombinedData(parsedArray, "salesRank");
      }
      const sorted = combinedData.sort((a, b) => a.epoch - b.epoch);

      return sorted;
    },
    []
  );

  const parsedSalesRanks = useMemo(
    () => parseSalesRank(salesRanks),
    [salesRanks, parseSalesRank]
  );

  const data = useMemo(
    () =>
      combineData(
        parseArray(ahstprcs),
        parseArray(auhstprcs),
        parseArray(anhstprcs),
        parsedSalesRanks
      ),
    [parsedSalesRanks, ahstprcs, anhstprcs, auhstprcs, combineData]
  );

  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (product.curr_salesRank === -1) {
    }
    return (
      <>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {payload.map((entry: any, index: number) => {
            switch (entry.dataKey) {
              case "amazonPrice":
                entry.value = `Amazon ${formatter.format(
                  product.avg90_ahsprcs / 100
                )} *`;
                entry.color = "#FFA500";
                break;
              case "usedPrice":
                entry.value = `Gebraucht ${formatter.format(
                  product.avg90_ausprcs / 100
                )} *`;
                entry.color = "#444444";
                break;
              case "newPrice":
                entry.value = `Neu ${formatter.format(
                  product.avg90_ansprcs / 100
                )} *`;
                entry.color = "#8888dd";
                break;
              case "salesRank":
                entry.value = `Bestseller Rang #${
                  product.curr_salesRank === -1 ? "N/A" : product.curr_salesRank
                }`;
                entry.color = "#3a883a";
                break;
            }
            return (
              <li
                key={`item-${index}`}
                style={{ marginBottom: 4 }}
                className="flex flex-row items-center"
              >
                <svg width="14" height="14" style={{ marginRight: 4 }}>
                  <circle cx="7" cy="7" r="7" fill={entry.color} />{" "}
                  {/* Default circle symbol */}
                </svg>
                <span style={{ color: entry.color }}>{entry.value}</span>{" "}
                {/* Customize text here */}
              </li>
            );
          })}
        </ul>
        <div className="text-xs">* 90 Tage-Durchschnitt</div>
      </>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <p
            className="label"
            style={{ marginBottom: "5px" }}
          >{`Datum: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            return (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {`${entry.name}: ${
                  entry.name === "salesRank"
                    ? `#${entry.value}`
                    : `${formatter.format(entry.value)}`
                }`}
              </p>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`cursor:pointer relative h-full w-full`}
    >
      <div
        className={`${
          isHovered
            ? "absolute z-[5000] bg-white top-0 right-0"
            : "flex items-center h-full"
        }`}
      >
        <LineChart
          width={isHovered ? 870 : 100}
          height={isHovered ? 500 : 50}
          data={data}
          margin={
            isHovered
              ? { top: 20, right: 5, left: 20, bottom: 5 }
              : {
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }
          }
        >
          {isHovered && (
            <>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" scale={"auto"} />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  formatter.format(
                    Math.round(Number(Math.round(value).toFixed(0)))
                  )
                }
                type="number"
                domain={["auto", "auto"]}
              />
              <YAxis />
              <YAxis
                yAxisId="right"
                tickFormatter={(value) => `#${Math.round(value).toFixed(0)}`}
                orientation="right"
                type="number"
                domain={["auto", "auto"]}
              />
              <YAxis />
              <Legend
                layout="vertical"
                verticalAlign="top"
                align="right"
                content={<CustomLegend />}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          {hasSalesRanks && (
            <Line
              yAxisId="right"
              dot={false}
              connectNulls
              type="monotone"
              dataKey="salesRank"
              stroke="#3a883a"
            />
          )}
          {isHovered && hasAhstprcs && (
            <Line
              yAxisId="left"
              type="step"
              dataKey="amazonPrice"
              connectNulls
              stroke="#ff9900"
            />
          )}
          {isHovered && hasAnhstprcs && (
            <Line
              yAxisId="left"
              type="step"
              connectNulls
              dataKey="newPrice"
              stroke="#8888dd"
            />
          )}
          {/* {isHovered && hasAuhstprcs && (
              <Line
                yAxisId="left"
                type="step"
                connectNulls
                dataKey="usedPrice"
                stroke="#444444"
              />
            )} */}
        </LineChart>
      </div>
    </div>
  );
};
