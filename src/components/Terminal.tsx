"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import React from "react";

const Terminal = ({ ip }: { ip: string }) => {
  const query = useQuery({
    queryKey: ["terminal", "authentication"],
    queryFn: async () => {
      const response = await fetch("/app/api/admin/terminal");
      return response.text();
    },
  });

  return (
    <Button
      disabled={query?.data === "unauthorized" || query.isLoading}
      href={`${process.env.NEXT_PUBLIC_COCKPIT_URL!}/@${ip}/system/terminal`}
      target="_blank"
    >
      Terminal
    </Button>
  );
};

export default Terminal;
