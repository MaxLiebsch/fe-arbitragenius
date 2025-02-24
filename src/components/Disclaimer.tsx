import { DISCLAIMER } from "@/constant/constant";
import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "antd";

const Disclaimer = () => {
  return (
    <>
    {/* <div className="hidden md:block absolute text-gray-dark text-xs right-0 top-[3.15rem]">
      {DISCLAIMER}
    </div> */}
    <div className="absolute right-0 top-[0rem] cursor-pointer flex flex-row gap-2 items-center" >
   <span className="text-gray-dark text-xs hidden md:block">
    Haftungsausschluss

   </span>
      <Tooltip title={DISCLAIMER}>
        <InformationCircleIcon className="w-6 h-6 text-gray-dark" />
      </Tooltip>
    </div>
    </>
  );
};

export default Disclaimer;
