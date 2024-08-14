"use client";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import React, { useState } from "react";

const Terminal = ({ ip }: { ip: string }) => {
  const [data, setData] = useState("unauthorized");
  const queryClient = useQueryClient();
  queryClient.getQueryCache().subscribe(({ query }) => {
    const queryKey = query.queryKey as QueryKey
    if(queryKey[0] === "terminal" && queryKey[1] === "authentication") {
      setData(query.state.data)
    }
  })
  

  return (
    <Button
      disabled={data === undefined || data === "unauthorized"}
      href={`${process.env.NEXT_PUBLIC_COCKPIT_URL!}/@${ip}/system/terminal`}
      target="_blank"
    >
      Terminal
    </Button>
  );
};

export default Terminal;
