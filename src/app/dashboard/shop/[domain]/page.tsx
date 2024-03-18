"use server";

import ProductsTable from "@/components/ProductsTable";
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

  return (
    <div className="h-full flex flex-col">
      <Title>{res.ne}</Title>
      <div className="grow">
        <ProductsTable className="h-full" domain={params.domain} />
      </div>
    </div>
  );
}
