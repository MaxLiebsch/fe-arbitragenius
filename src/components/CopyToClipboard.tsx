import { Tooltip, message } from "antd";
import { useState } from "react";
import { CheckIcon } from "./Icons";

const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      className="cursor-pointer hover:text-gray-600 hover:text-md"
      onClick={copyToClipboard}
    >
      <Tooltip
        color={"#11848d"}
        destroyTooltipOnHide
        title={
          <div className="whitespace-nowrap">
            {copied ? (
              <div className="flex flex-row gap-2">
                <span>{text} kopiert!</span>
                <span>
                  <CheckIcon fontSize={10} />
                </span>
              </div>
            ) : (
              "In Zwischenablage kopieren"
            )}
          </div>
        }
      >
        {text}
      </Tooltip>
    </button>
  );
};

export default CopyToClipboard;
