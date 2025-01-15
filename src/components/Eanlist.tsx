import React from "react";
import CopyToClipboard from "./CopyToClipboard";

const Eanlist = ({ eanList }: { eanList?: string[] }) => {
  return (
    <>
      {eanList && eanList.length ? (
        <div className="flex flex-row gap-1">
          <span className="font-semibold">EAN:</span>
          <div className="flex flex-row gap-2">
            {eanList.map((ean: string) => (
              <CopyToClipboard key={ean} text={ean} />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Eanlist;
