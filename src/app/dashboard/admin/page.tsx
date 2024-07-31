import MatchChecker from "@/components/MatchChecker";
import { getLoggedInUser } from "@/server/appwrite";
import { mongoPromise } from "@/server/mongo";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const user = await getLoggedInUser();

  if (!user?.labels.includes("admin")) redirect("/");

  const mongo = await mongoPromise;

  const shops = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .find({
      active: { $eq: true },
    })
    .toArray();


  return (
    <div>
      <MatchChecker shops={shops} />
    </div>
  );
};

export default Page;
