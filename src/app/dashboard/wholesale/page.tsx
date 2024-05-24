"use client";
import React, { RefAttributes, useEffect, useRef } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { message, Space, Upload } from "antd";
import useTasks from "@/hooks/use-tasks";
import { UploadChangeParam } from "antd/es/upload";
import Papa from "papaparse";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import {  ProductRow } from "@/types/wholesaleProduct";
import { appendPercentage, formatCurrency, getPrice } from "@/util/formatter";
import { calculationDeduction } from "@/util/calculateDeduction";
import { z } from "zod";
import parsePrice from "parse-price";
import { LinkWrapper } from "@/components/LinkWrapper";
import { Button } from "@/components/Button";
import useCreateTask from "@/hooks/use-task-create";
import Spinner from "@/components/Spinner";
import TaskCard from "@/components/TaskCard";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: false,
  beforeUpload: (file) => {
    const isCSV = file.type === "text/csv";
    if (!isCSV) {
      message.error(`${file.name} ist keine CSV-Datei!`);
    }
    return isCSV || Upload.LIST_IGNORE;
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const translations = {
  category: ["Kategorie", "Category"],
  name: ["Name", "Name","Beschreibung", "Description", 'PRODUCT DESCRIPTION'],
  price: ["Preis", "Price", "PRICE EUR"],
  ean: ["EAN"],
  reference: ["REF. NO.", "Referenz", "Reference"],
};

const columns: GridColDef<ProductRow>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "reference",
    headerName: "Referenz",
    width: 150,
  },
  {
    field: "ean",
    headerName: "EAN",
    width: 150,
    // editable: true,
  },
  {
    field: "category",
    headerName: "Kategorie",
    width: 150,
    // editable: true,
  },
  {
    field: "nm",
    headerName: "Info",
    flex: 0.3,
    maxWidth: 600,
    renderCell: (params) => {
      return (
        <div className="flex flex-col divide-y p-1">
          <div>
            {LinkWrapper("https://arbispotter.com", params.row.name, "")}
          </div>
          Zielshop:
          {LinkWrapper(params.row[`a_lnk`], params.row[`a_nm`])}
          {/* {target === "a" && params.row["bsr"] && params.row["bsr"].length ? (
            <div className="">
              <span className="font-semibold">BSR:</span>
              <span className="">
                {params.row["bsr"].map((bsr: any) => {
                  return (
                    <span className="mx-1" key={bsr.number + bsr.category}>
                      Nr.{bsr.number.toLocaleString("de-DE")} in {bsr.category}
                    </span>
                  );
                })}
              </span>
            </div>
          ) : (
            <></>
          )} */}
          {/* {params.row["asin"] && params.row["asin"] !== "" && (
            <div>
              <span className="font-semibold">ASIN: </span>
              {params.row["asin"]}
            </div>
          )} */}
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Preis",
    type: "number",
    width: 110,
    valueFormatter: (params) =>
      formatCurrency(calculationDeduction(parseFloat(params.value), true)),
    // editable: true,
  },
  {
    field: `a_prc`,

    headerName: "Amazon Preis",
    renderHeader: (params) => (
      <div className="relative">
        <div>Amazon Preis</div>
      </div>
    ),
    valueFormatter: (params) =>
      formatCurrency(calculationDeduction(parseFloat(params.value), true)),
  },
  {
    field: `a_mrgn_pct`,
    headerName: "Marge %",
    valueFormatter: (params) => appendPercentage(params.value),
  },
  {
    field: `a_mrgn`,
    headerName: "Marge €",
    renderCell: (params) => (
      <div className="text-green-600 font-semibold">
        {formatCurrency(calculationDeduction(parseFloat(params.value), true))}
      </div>
    ),
  },
];

const productSchema = z.object({
  ean: z.string(),
  name: z.string().optional().default(""),
  category: z.string().optional().default(""),
  price: z.number(),
  id: z.number(),
  reference: z.string().optional().default(""),
});

function getCaseInsensitiveProperty(obj: any, properties: string[]) {
  for (const property of properties) {
    const lowerCaseProperty = property.toLowerCase();
    for (const key in obj) {
      if (
        obj.hasOwnProperty(key) &&
        key.toLowerCase().includes(lowerCaseProperty)
      ) {
        return obj[key];
      }
    }
  }
  return undefined;
}

const Page = () => {
  const tasks = useTasks();
  const createTaskMutation = useCreateTask();
  const [rows, setRows] = React.useState<ProductRow[]>([]);
  const ref = useRef<any | null>(null);

  const handleImport = async (info: UploadChangeParam<UploadFile<any>>) => {
    const { status, originFileObj } = info.file;
    if (status === "done") {
      const parsedRows: ProductRow[] = [];
      let cnt = 0;
      let cntErrors = 0;
      Papa.parse(originFileObj as File, {
        header: true,
        skipEmptyLines: true,
        step: function (results: any, parser) {
          cnt++;
          if (cnt > 10000) {
            message.info(`Maximum von ${cnt - 1} Produkten überschritten.`);
            parser.abort();
          }
          const price = getCaseInsensitiveProperty(
            results.data,
            translations.price
          );
          const testRow: ProductRow = {
            id: 0,
            ean: getCaseInsensitiveProperty(results.data, translations.ean),
            name: getCaseInsensitiveProperty(results.data, translations.name),
            category: getCaseInsensitiveProperty(
              results.data,
              translations.category
            ),
            price: parseInt(price)
              ? parsePrice(getPrice(price ? price.replace(/\s+/g, "") : ""))
              : "",
            reference: getCaseInsensitiveProperty(
              results.data,
              translations.reference
            ),
          };
          const res = productSchema.safeParse(testRow);
          if (!res.success) {
            const allValuesEmpty = Object.values(results.data).every((val: any) => val === "")
            if(!allValuesEmpty){
              cntErrors++;
              console.error(res.error.errors);
            }
          } else {
            parsedRows.push(res.data); // Push parsed row into array
          }
        },
        complete: (result) => {
          message.success(`${info.file.name} Datei erfolgreich hochgeladen.`);
          message.error(`${cntErrors} Zeilen konnten nicht verarbeitet werden.`)
          setRows(
            parsedRows.map((row, i) => {
              return {
                ...row,
                id: i,
              };
            })
          );
        },
      });
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleStartTask = async () => {
    createTaskMutation.mutate({ body: rows });
  };

  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      message.success("Task erfolgreich gestartet");
      setRows([]);
      if (ref.current && ref.current.fileList.length > 0) {
        ref.current.fileList = [];
      }
      createTaskMutation.reset();
    }
    if (createTaskMutation.isError) {
      message.error(
        createTaskMutation.error?.message ?? "Fehler beim Starten des Tasks"
      );
      createTaskMutation.reset();
    }
  }, [createTaskMutation]);

  return (
    <main className="h-full flex flex-col space-y-5">
      <section className="grow">
        <div className="flex flex-col gap-2 mb-6">
          <Dragger
            ref={ref}
            className="w-full"
            onChange={(info) => handleImport(info)}
            {...props}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Klicke hier oder ziehe die CSV-Datei zum Hochladen in diesen
              Bereich!
            </p>
            <p className="ant-upload-hint">
              Unterstützte Dateitypen: .csv <br />
              Maximal 10000 Produkte
            </p>
            <p className="ant-upload-hint">
              Notwendige Spaltenköpfe : EAN(ean), Preis(Preis, Price, PRICE EUR)
            </p>
            <p className="ant-upload-hint">
              Optinale Spaltenköpfe: Name(name), Kategorie(category),
              Referenz(REF. NO., Referenz, Reference)
            </p>
          </Dragger>
          <div>
                <Button
                  disabled={createTaskMutation.isPending || !rows.length}
                  onClick={() => handleStartTask()}
                  className="mb-3 min-w-32"
                >
                  {createTaskMutation.isPending ? (
                    <div className="w-full flex justify-center">
                      <Spinner size={"!w-6"} />
                    </div>
                  ) : (
                    <>Start Analyse</>
                  )}
                </Button>
            {rows.length ? (
              <>
                <DataGridPremium
                  autoHeight
                  rows={rows}
                  rowCount={rows.length}
                  columns={columns}
                  pagination
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 20,
                      },
                    },
                  }}
                  pageSizeOptions={[20, 50, 100]}
                  // checkboxSelection
                  disableRowSelectionOnClick
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <div>
            {tasks.isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold leading-6 text-gray-900 flex flex-row space-x-1 items-center mb-3">
                  <div>Wholesale Analysen</div>
                </h3>
                <Space direction="horizontal" size={16}>
                  {(tasks.data ?? []).map((task) => (
                    <TaskCard key={task._id.toString()} task={task} />
                  ))}
                </Space>
              </>
            )}
            {tasks.data && tasks.data.length === 0 && (
              <div>
                Keine Wholesale Analysen - Du kannst eine Analyse erstellen.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
