"use server";

import SalesTableTabs from "@/components/SalesTableTabs";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";
import { createAdminClient, getLoggedInUser } from "@/server/appwrite";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ searchParams }: { searchParams: { target: string } }) => {
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
      <Title>Deal-Monitor</Title>
      <SalesTableTabs settings={settings} />
    </div>
  );
};

export default Page;
