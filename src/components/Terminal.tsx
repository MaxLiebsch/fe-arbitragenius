"use client";
import { Button } from "antd";
import React, { useState } from "react";

const Terminal = ({ ip }: { ip: string }) => {
  return (
    <Button
      href={`termius://app/host-sharing#ip=${ip}&port=22&username=root`}
      target="_blank"
    >
      Terminal
    </Button>
  );
};

export default Terminal;
