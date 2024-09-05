import { Settings } from "@/types/Settings";
import ImageRenderer from "../components/ImageRenderer";
import { prefixLink } from "@/util/prefixLink";
import CopyToClipboard from "../components/CopyToClipboard";
import ContentMarge from "../components/ContentMarge";
import { Popover } from "antd";
import { calculationDeduction } from "@/util/calculateDeduction";
import { LinkWrapper } from "../components/LinkWrapper";
import { GridColDef } from "@mui/x-data-grid-premium";
import { CheckIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { appendPercentage, formatCurrency } from "./formatter";
import MarginPct from "@/components/columns/MarginPct";
import Margin from "@/components/columns/Margin";

export const createWholeSaleColumns: (
  target: string,
  settings: Settings
) => GridColDef[] = (target, settings) => [
  {
    field: "category",
    headerName: "Kategorie",
    renderCell: (params) => {
      if (typeof params.row.ctrgy === "string") {
        return <>{params.row.ctrgry}</>;
      } else if (Array.isArray(params.row.ctgry)) {
        return (
          <div className="flex flex-col">
            {params.row.ctgry.map((ctrgy: string, i: number) => (
              <div key={ctrgy + i}>{ctrgy}</div>
            ))}
          </div>
        );
      }
    },
  },
  {
    field: "reference",
    headerName: "Referenz",
    width: 150,
  },
  {
    field: `ean`,
    headerName: "EAN",
    width: 150,
    renderCell: (params) => <CopyToClipboard text={params.row.ean} />,
  },
  {
    field: "name",
    headerName: "Info",
    flex: 1,
    renderCell: (params) => {
      return (
        <>
          {params.row["status"] === "not found" ? (
            <div className="text-red-600">Produkt nicht gefunden</div>
          ) : (
            <div className="flex flex-col divide-y p-1">
              <div>{params.row.name}</div>
              {params.row[`a_lnk`] && (
                <div>
                  Amazon:
                  {LinkWrapper(params.row[`a_lnk`], params.row[`a_nm`])}
                </div>
              )}
              {target === "a" &&
              params.row["bsr"] &&
              params.row["bsr"].length ? (
                <div className="">
                  <span className="font-semibold">BSR:</span>
                  <span className="">
                    {params.row["bsr"].map((bsr: any) => {
                      return (
                        <span className="mx-1" key={bsr.number + bsr.category}>
                          Nr.{bsr.number.toLocaleString("de-DE")} in{" "}
                          {bsr.category}
                        </span>
                      );
                    })}
                  </span>
                </div>
              ) : (
                <></>
              )}
              {params.row["asin"] && params.row["asin"] !== "" && (
                <div>
                  <span className="font-semibold">ASIN: </span>
                  <CopyToClipboard text={params.row["asin"]} />
                  {params.row["buyBoxIsAmazon"] !== undefined && (
                    <span>
                      {params.row["buyBoxIsAmazon"] ? (
                        <span>
                          <span className="font-semibold"> BuyBox:</span>
                          <span className="text-amazon"> Amazon</span>
                        </span>
                      ) : (
                        <span>
                          <span className="font-semibold"> BuyBox:</span>
                          <span className="text-green-600 font-medium">
                            {" "}
                            Seller
                          </span>
                        </span>
                      )}
                    </span>
                  )}
                  {params.row["totalOfferCount"] !== undefined && (
                    <span>
                      <span>
                        <span className="font-semibold"> Seller:</span>
                        {params.row["totalOfferCount"] ? (
                          <span className="">
                            {" "}
                            {params.row["totalOfferCount"]}
                          </span>
                        ) : (
                          "0"
                        )}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      );
    },
  },
  {
    field: "prc",
    headerName: `Preis`,
    renderHeader: (params) => (
      <div className="relative">
        <div>Preis</div>
        <div className="absolute bottom-1 text-xs text-gray-500">
          {settings?.netto ? "Netto" : "Brutto"}
        </div>
      </div>
    ),
    width: 80,
    valueFormatter: (params) =>
      formatCurrency(
        calculationDeduction(parseFloat(params.value), settings.netto)
      ),
  },
  {
    field: `${target}_lnk`,
    headerName: "Amazon Link",
  },
  {
    field: `${target}_img`,
    headerName: "Amazon Bild",
    cellClassName: "hover:!overflow-visible",
    renderCell: (params) => ImageRenderer(prefixLink(params.row.a_img, "")),
  },
  {
    field: `${target}_prc`,
    headerName: "Amazon Preis",
    renderHeader: (params) => (
      <div className="relative">
        <div>Zielshoppreis</div>
        <div className="absolute bottom-1 text-xs">
          {settings?.netto ? "Netto" : "Brutto"}
        </div>
      </div>
    ),
    valueFormatter: (params) =>
      formatCurrency(
        calculationDeduction(parseFloat(params.value), settings.netto)
      ),
  },
  {
    field: "bsr_1",
    headerName: "BSR 1",
  },
  {
    field: "bsr_cat_1",
    headerName: "BSR 1 Kategorie",
  },
  {
    field: "bsr_2",
    headerName: "BSR 2",
  },
  {
    field: "bsr_cat_2",
    headerName: "BSR 2 Kategorie",
  },
  {
    field: "bsr_3",
    headerName: "BSR 3",
  },
  {
    field: "bsr_cat_3",
    headerName: "BSR 3 Kategorie",
  },
  {
    field: "asin",
    headerName: "Amazon ASIN",
  },
  MarginPct({ target, settings }),
  Margin({ target, settings }),
  {
    field: `status`,
    headerName: "Status",
    renderCell: (params) => (
      <div className="text-green-600 font-semibold h-8 w-8">
        {params.value === "complete" ? (
          <CheckIcon fontSize={16} />
        ) : (
          <EyeSlashIcon fontSize={16} />
        )}
      </div>
    ),
  },
];
