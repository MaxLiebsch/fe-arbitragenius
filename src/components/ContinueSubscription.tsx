import React, { useState } from "react";
import { Button } from "./Button";
import { Modal } from "antd";
import { useSubscriptionUpdate } from "@/hooks/use-subscription-update";
import Stripe from "stripe";
import { STATUS } from "./Subscription";

const ContinueSubscription = ({
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
    if (status === "canceled") {
      mutateSubscription.mutate({
        subscriptionId: id,
        update: {
          cancel_at_period_end: false,
          cancel_at: null,
          canceled_at: null,
        },
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Button onClick={showModal}>Subscription fortsetzen</Button>
      <Modal
        title={"Subscription fortsetzen"}
        open={isModalOpen}
        cancelButtonProps={{ disabled: mutateSubscription.isPending }}
        okText={"Ja, Subscription fortsetzen"}
        onOk={handleOk}
        okButtonProps={{ disabled: mutateSubscription.isPending }}
        onCancel={handleCancel}
      >
        <p>{STATUS[status].continueMessage}</p>
        {mutateSubscription.isPending && <p>Bitte warten...</p>}
      </Modal>
    </div>
  );
};

export default ContinueSubscription;
