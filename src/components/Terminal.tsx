"use client";
import { Button } from "antd";
import React, { useState } from "react";

const Terminal = ({ ip, name }: { ip: string; name: string }) => {
  return (
    <Button
      href={`termius://app/host-sharing#ip=${ip}&label=${name}&port=22&username=root`}
      target="_blank"
    >
      Terminal
    </Button>
  );
};

export default Terminal;
