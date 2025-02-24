import { Popover, Radio, Tooltip } from "antd";
import React from "react";
import { ModifiedProduct } from "@/types/Product";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

const KeepaGraphPopover = ({ product }: { product: ModifiedProduct }) => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState("30");
  const mediaQuery = useMediaQuery("(min-width: 870px)");
  if(!product.asin) return null;
  return (
    <div className="hover:cursor-pointer hover:font-semibold">
      <div className="grid grid-cols-4 items-center">
        <div>
          <Radio.Group block defaultValue="30" optionType="button" onChange={(e) => setRange(e.target.value)}>
            <div className="grid grid-rows-4">
              <Radio.Button style={{ padding: "0px 1px" }} value="30">
                30
              </Radio.Button>
              <Radio.Button style={{ padding: "0px 1px" }} value="90">
                90
              </Radio.Button>
              <Radio.Button style={{ padding: "0px 1px" }} value="180">
                180
              </Radio.Button>
              <Radio.Button style={{ padding: "0px 1px" }} value="365">
                365
              </Radio.Button>
            </div>
          </Radio.Group>
        </div>
        <div className="col-span-3">
          <Popover
            placement="left"
            arrow={false}
            destroyTooltipOnHide
            onOpenChange={setOpen}
            trigger="click"
            overlayInnerStyle={{ pointerEvents: "auto" }}
            content={
              <div className={`w-[${mediaQuery ? "870px" : "360px"}] h-[${mediaQuery ? "500px" : "206px"}]`}>
                <Image
                  alt={`Keepa Graph ${product.asin}`}
                  height={mediaQuery ? 500 : 206}
                  width={mediaQuery ? 870 : 360}
                  src={`https://graph.keepa.com/pricehistory.png?asin=${product.asin}&domain=de&salesrank=1&range=${range}&height=500&width=870&bb=1`}
                />
              </div>
            }
          >
            <Tooltip
              color={"#11848d"}
              destroyTooltipOnHide
              title="Detailierte Graphenansicht"
            >
              <Image
                alt={`Keepa Graph ${product.asin}`}
                height={70}
                width={120}
                src={`https://graph.keepa.com/pricehistory.png?asin=${product.asin}&domain=de&salesrank=1&range=${range}&height=70&width=120&bb=1`}
              />
            </Tooltip>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default KeepaGraphPopover;
