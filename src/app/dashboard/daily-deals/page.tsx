"use server";

import SalesTableTabs from "@/components/SalesTableTabs";
import { getLoggedInUser } from "@/server/appwrite";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import React from "react";
import Disclaimer from "@/components/Disclaimer";

const Page = async () => {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="h-full flex flex-col overflow-y-hidden relative">
      <Title>Sales Monitor</Title>
      <Disclaimer />
      <SalesTableTabs />
    </div>
  );
};

export default Page;
