"use server";

import ProductsTableTabs from "@/components/ProductsTableTabs";
import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import React from "react";

export default async function Shop({ params }: { params: { domain: string } }) {
  const mongo = await clientPool["NEXT_MONGO"];

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .findOne({ d: { $eq: params.domain }, active: { $eq: true } });

  if (!res) redirect("/dashboard");

  const user = await getLoggedInUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      <Title>{res.ne}</Title>
      <ProductsTableTabs domain={params.domain} />
    </div>
  );
}
