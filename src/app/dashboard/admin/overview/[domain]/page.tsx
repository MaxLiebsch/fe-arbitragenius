import TaskEditor from "@/components/TaskEditor";
import { getLoggedInUser } from "@/server/appwrite";
import { mongoAdminPromise } from "@/server/mongo";
import { CrawlTask } from "@/types/tasks";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({
  params,
}: {
  params: { domain: string };
  searchParams: {};
}) => {
  const user = await getLoggedInUser();

  if (!user?.labels.includes("admin")) redirect("/");

  const mongo = await mongoAdminPromise;

  const tasks = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection("tasks")
    .find({ shopDomain: params.domain })
    .toArray();

  if (!tasks.length) redirect("/");

  const _tasks = tasks
    .filter((task) => task.type === "CRAWL_SHOP")
    .map((task) => {
      return { ...task, _id: task._id.toString() };
    }) as CrawlTask[];

  return (
    <div>
      <div>Shop: {params.domain}</div>
      <div>
        {_tasks.map((task) => (
          <div key={task.id}>
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Task: {task.id}
            </h2>
            <TaskEditor task={{ ...task, _id: task._id.toString() }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
