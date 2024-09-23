import Spinner from "@/components/Spinner";
import WholeSaleProductsTable from "@/components/WholesaleProductsTable";
import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { format, parseISO } from "date-fns";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/login");
  }

  const mongo = await clientPool["NEXT_MONGO_CRAWLER_DATA_ADMIN"];

  const task = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA ?? "")
    .collection(process.env.NEXT_MONGO_TASKS ?? "")
    .findOne({
      userId: user.$id,
      _id: new ObjectId(params.id),
    });

  if (!task) redirect("/dashboard/wholesale");

  const isWholeSaleEbyTask = task.type === "WHOLESALE_EBY_SEARCH";

  const inProgress = task.executing;
  const progress =
    Number((task.progress.completed / task.progress.total).toFixed(2)) * 100;
  return (
    <>
      <div>
        Ziel: {task.type === "WHOLESALE_EBY_SEARCH" ? "Ebay" : "Amazon"}
      </div>
      <div>Fortschritt: {progress} %</div>
      <div key={task._id.toString()}>
        Status:{" "}
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
      <div className="text-xs text-seconadary-400">
        Erstellt am: {format(parseISO(task.createdAt), "Pp")}
      </div>
      <div className="w-full h-[89%] min-h-[89%] mt-2">
        <WholeSaleProductsTable
          target={isWholeSaleEbyTask ? "e" : "a"}
          taskId={id}
        />
      </div>
    </>
  );
};

export default Page;
