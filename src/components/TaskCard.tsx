import { DbTask } from "@/types/tasks";
import { Button, Card, Tooltip, Typography, message } from "antd";
import React, { useEffect } from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import Spinner from "./Spinner";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/16/solid";
import useDeleteTask from "@/hooks/use-task-delete";
import useUpdateTask from "@/hooks/use-task-update";

const TaskCard = ({ task }: { task: DbTask }) => {
  const inProgress = task.executing;
  const target = task.type === "WHOLESALE_EBY_SEARCH" ? "e" : "a";
  const progress = (
    Number(task.progress.completed / task.progress.total) * 100
  ).toFixed(0);
  const deleteTask = useDeleteTask({ taskId: task._id.toString(), target });
  const updateTask = useUpdateTask();
  useEffect(() => {
    if (deleteTask.isSuccess) {
      deleteTask.reset();
      message.success("Task wurde gelöscht");
    }
    if (deleteTask.isError) {
      deleteTask.reset();
      message.error(deleteTask.error.message);
    }
  }, [deleteTask]);

  return (
    <Card
      extra={
        <Link
          className="text-secondary"
          href={`/dashboard/wholesale/task/${task._id.toString()}`}
        >
          Analyse öffnen
        </Link>
      }
      title={
        <Typography.Text
          editable={{
            onChange: (newName) => {
              if (newName === task.name) return;
              if (newName.length < 1) {
                message.error("Name darf nicht leer sein");
                return;
              }
              updateTask.mutate({
                taskId: task._id.toString(),
                body: { name: newName },
              });
            },
          }}
        >
          {`${task?.name || "Task"}`}
        </Typography.Text>
      }
      style={{ minWidth: 300 }}
    >
      <div className="flex flex-col">
        <div>
          Ziel: {task.type === "WHOLESALE_EBY_SEARCH" ? "Ebay" : "Amazon"}
        </div>
        <div className="flex flex-row gap-1" key={task._id.toString()}>
          <span>Status:</span>
          {task.progress.completed === task.progress.total ? (
            "Abgeschlossen"
          ) : inProgress ? (
            <span className="flex gap-4 items-center">
              <span>In Arbeit</span>
              <Spinner size="!h-4" />{" "}
            </span>
          ) : (
            "In Warteschlange"
          )}
        </div>
        <div>Fortschritt: {progress} %</div>
        <div>Anzahl Produkte: {task.progress.total}</div>
        <div className="text-xs text-seconadary-400">
          Erstellt am: {format(parseISO(task.createdAt), "Pp")}
        </div>
        <div className="ml-auto z-50 flex flex-row gap-1">
          <Tooltip title="Analyse erneut ausführen - coming soon">
            <Button
              type="primary"
              disabled={true}
              shape="circle"
              icon={
                <ArrowPathIcon
                  className="h-4 w-4"
                  fontSize={16}
                  color="bg-secondary-950"
                />
              }
            />
          </Tooltip>
          <Tooltip title="Analyse löschen. Der Vorgang kann nicht rückgängig gemacht werden">
            <Button
              type="primary"
              disabled={deleteTask.isPending}
              onClick={(e) => {
                e.stopPropagation();
                deleteTask.mutate();
              }}
              shape="circle"
              icon={
                <TrashIcon
                  className="h-4 w-4"
                  fontSize={16}
                  color="bg-secondary-950"
                />
              }
            />
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
