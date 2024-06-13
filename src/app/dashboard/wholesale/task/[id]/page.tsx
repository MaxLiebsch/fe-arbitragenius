import Spinner from "@/components/Spinner";
import WholeSaleProductsTable from "@/components/WholesaleProductsTable";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";
import { createAdminClient, getLoggedInUser } from "@/server/appwrite";
import { mongoAdminPromise } from "@/server/mongo";
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
  const { users } = await createAdminClient();
  const prefs = (await users.getPrefs(user.$id)) as any;

  let settings = defaultProductFilterSettings;

  if (prefs?.settings && Object.keys(JSON.parse(prefs.settings)).length > 0) {
    settings = JSON.parse(prefs.settings);
  }

  const mongo = await mongoAdminPromise;

  const task = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA ?? "")
    .collection(process.env.NEXT_MONGO_TASKS ?? "")
    .findOne({
      userId: user.$id,
      _id: new ObjectId(params.id),
    });

  if (!task) redirect("/dashboard/wholesale");

  const inProgress = task.executing;

  return (
    <>
      <div>
        Fortschritt:{" "}
        {((task.progress.total - task.progress.pending) / task.progress.total) *
          100}{" "}
        %
      </div>
      <div key={task._id.toString()}>
        Status:{" "}
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
      <div className="text-xs text-seconadary-400">
        Erstellt am: {format(parseISO(task.createdAt), "Pp")}
      </div>
      <div className="w-full h-[89%] min-h-[89%] mt-2">
        <WholeSaleProductsTable taskId={id} settings={settings} />
      </div>
    </>
  );
};

export default Page;
