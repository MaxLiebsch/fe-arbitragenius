import { DbTask } from "@/types/tasks";
import { Button, Card, Tooltip, message } from "antd";
import React, { useEffect } from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import Spinner from "./Spinner";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/16/solid";
import useDeleteTask from "@/hooks/use-task-delete";

const TaskCard = ({ task }: { task: DbTask }) => {
  const inProgress = task.executing;
  const deleteTask = useDeleteTask({ taskId: task._id.toString() });

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
          className="text-secondary-950"
          href={`/dashboard/wholesale/task/${task._id.toString()}`}
        >
          Analyse öffnen
        </Link>
      }
      title={<div className="flex flex-row gap-10">{`Task ${task._id}`}</div>}
      style={{ width: 400 }}
    >
      <div className="flex flex-col">
        <div className="flex flex-row gap-1" key={task._id.toString()}>
          <span>Status:</span>
          {task.progress.pending === 0 ? (
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
        <div>
          Fortschritt:{" "}
          {((task.progress.total - task.progress.pending) /
            task.progress.total) *
            100}{" "}
          %
        </div>
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
