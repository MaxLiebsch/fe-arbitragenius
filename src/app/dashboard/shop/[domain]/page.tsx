"use server";

import ProductsTableTabs from "@/components/ProductsTableTabs";
import {
  createAdminClient,
  createSessionClient,
  getLoggedInUser,
} from "@/server/appwrite";
import { mongoPromise } from "@/server/mongo";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import React from "react";

export default async function Shop({ params }: { params: { domain: string } }) {
  const mongo = await mongoPromise;

  const res = await mongo
    .db(process.env.NEXT_MONGO_DB)
    .collection(process.env.NEXT_MONGO_SHOPS ?? "shops")
    .findOne({ d: { $eq: params.domain }, active: { $eq: true } });

  if (!res) redirect("/dashboard");

  const user = await getLoggedInUser();
  if (!user) {
    redirect("/login");
  }
  const { users } = await createAdminClient();
  const userPrefs = await users.getPrefs(user.$id);
  let settings = {
    netto: true,
    minMargin: 0,
    minPercentageMargin: 0,
    maxPrimaryBsr: 1000000,
    maxSecondaryBsr: 1000000,
    productsWithNoBsr: true,
  };
  // @ts-ignore
  if (userPrefs?.settings) {
    //@ts-ignore
    settings = JSON.parse(userPrefs.settings);
  }

  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      <Title>{res.ne}</Title>
      <ProductsTableTabs settings={settings} domain={params.domain} />
    </div>
  );
}
