import React, { useState } from "react";
import { Button } from "./Button";
import { Modal } from "antd";
import { useSubscriptionUpdate } from "@/hooks/use-subscription-update";
import Stripe from "stripe";
import { STATUS } from "./Subscription";

const CancelSubscription = ({
  subscription,
  status,
}: {
  status: Stripe.Subscription.Status;
  subscription: Stripe.Subscription;
}) => {
  let { id } = subscription;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mutateSubscription = useSubscriptionUpdate(setIsModalOpen);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (status === "trialing") {
      mutateSubscription.mutate({
        subscriptionId: id,
        update: {},
      });
    }
    if (status === "active") {
      mutateSubscription.mutate({
        subscriptionId: id,
        update: { cancel_at_period_end: true },
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button  className="w-full" onClick={showModal} disabled={status === "canceled"}>
        {status === "trialing"
          ? "Testphase beenden"
          : status === "canceled"
          ? "Gekündigt"
          : "Kündigen"}
      </Button>
      <Modal
        title={`${
          status === "trialing" ? "Testphase beenden" : "Subscription kündigen"
        }`}
        open={isModalOpen}
        okButtonProps={{ disabled: mutateSubscription.isPending }}
        okText={
          status === "trialing"
            ? "Ja, Testphase beenden"
            : "Ja, Subscription kündigen"
        }
        onOk={handleOk}
        cancelButtonProps={{ disabled: mutateSubscription.isPending }}
        onCancel={handleCancel}
      >
        <p>{STATUS[status].cancelMessage}</p>
        {mutateSubscription.isPending && <p>Bitte warten...</p>}
      </Modal>
    </>
  );
};

export default CancelSubscription;
