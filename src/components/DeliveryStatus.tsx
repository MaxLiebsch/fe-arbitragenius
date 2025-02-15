import { deliveryStatus } from "@/types/deliveryStatus";
import React from "react";

const getColor = (a: deliveryStatus) => {
  switch (a) {
    case deliveryStatus.l0:
      return "bg-green-500";
    case deliveryStatus.l1:
      return "bg-yellow-500";
    case deliveryStatus.l2:
      return "bg-red-500";
  }
};

const DeliveryStatus = ({ a }: { a: deliveryStatus }) => {
  return (
    <div className="flex items-center space-x-1">
      <span className={`rounded-full h-2 w-2 ${getColor(a)}`}></span>
      <span className="text-gray text-xs">{a}</span>
    </div>
  );
};

export default DeliveryStatus;
