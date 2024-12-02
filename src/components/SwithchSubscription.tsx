import React, { useState } from "react";
import { Button } from "./Button";
import { Modal } from "antd";
import Stripe from "stripe";
import { STATUS } from "./Subscription";
import Badge from "./Badge";
import { useSubscriptionSwitch } from "@/hooks/use-subscription-switch";

const SwitchSubscription = ({
  subscription,
  status,
}: {
  status: Stripe.Subscription.Status;
  subscription: Stripe.Subscription;
}) => {
  //@ts-ignore
  let { id, plan } = subscription;
  const interval = plan.interval;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mutateSubscription = useSubscriptionSwitch(setIsModalOpen);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    mutateSubscription.mutate({
      subscriptionId: id,
      update: { newInterval: interval === "month" ? "year" : "month" },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="relative w-full">
        {interval === "month" && (
          <div className="absolute -top-6 -right-2">
            <Badge text={"Spare 33%!"} color={"yellow"} />
          </div>
        )}
        <Button className="w-full" onClick={showModal}>
          Umwandeln
        </Button>
      </div>
      <Modal
        title={"Subscription ändern"}
        open={isModalOpen}
        okButtonProps={{ disabled: mutateSubscription.isPending }}
        okText={"Ja, Subscription ändern"}
        onOk={handleOk}
        cancelButtonProps={{ disabled: mutateSubscription.isPending }}
        onCancel={handleCancel}
      >
        <p>
          {interval === "month"
            ? STATUS[status].monthToYearMessage
            : STATUS[status].yearToMonthMessage}
        </p>
        <p>{STATUS[status].switchSubscriptionMessage}</p>
        {mutateSubscription.isPending && <p>Bitte warten...</p>}
      </Modal>
    </>
  );
};

export default SwitchSubscription;
