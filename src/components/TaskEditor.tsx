"use client";

import React from "react";
import Ajv from "ajv";
import "jsoneditor-react/es/editor.min.css";
import { CrawlTask, taskSchema } from "@/types/tasks";
import dynamic from "next/dynamic";
import { message } from "antd";
const JsonEditor = dynamic(
    //@ts-ignore
  () => import("jsoneditor-react").then((mod) => mod.JsonEditor),
  { ssr: false }
) as any;

const TaskEditor = ({ task }: { task: CrawlTask }) => {
  const ajv = new Ajv({ allErrors: true, verbose: true, strict: false });
  const validate = ajv.compile(taskSchema);
  const valid = validate(task);
  if (!valid) console.log(validate.errors);
  return (
    <JsonEditor
      value={task}
      ajv={ajv}
      schema={taskSchema}
      onChange={(data: any) => {
        if (!validate(data))
          message.error(
            `Invalid task: ${JSON.stringify(validate.errors, null, 2)}`
          );
        else message.success("Task is valid - updated");
      }}
    />
  );
};

export default TaskEditor;
