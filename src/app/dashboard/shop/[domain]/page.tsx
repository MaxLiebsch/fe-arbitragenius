"use server";

import ProductsTableTabs from "@/components/ProductsTableTabs";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";
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
  const prefs = (await users.getPrefs(user.$id)) as any;

  let settings = defaultProductFilterSettings;

  if (prefs?.settings && Object.keys(JSON.parse(prefs.settings)).length > 0) {
    settings = JSON.parse(prefs.settings);
  }

  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      <Title>{res.ne}</Title>
      <ProductsTableTabs settings={settings} domain={params.domain} />
    </div>
  );
}
