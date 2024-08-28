"use server";

import SalesTableTabs from "@/components/SalesTableTabs";
import { getLoggedInUser } from "@/server/appwrite";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full flex flex-col overflow-y-hidden">
      <Title>Sales Monitor</Title>
      <SalesTableTabs />
    </div>
  );
};

export default Page;
