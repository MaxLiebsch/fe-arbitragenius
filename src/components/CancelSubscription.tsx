import React, { useState } from "react";
import { Button } from "./Button";
import { Checkbox, Modal, Radio } from "antd";
import { useSubscriptionUpdate } from "@/hooks/use-subscription-update";
import Stripe from "stripe";
import { STATUS } from "./Subscription";
import { Input } from "antd";

const { TextArea } = Input;

const FEEDBACK = [
  "customer_service",
  "low_quality",
  "missing_features",
  "switched_service",
  "too_complex",
  "too_expensive",
  "unused",
  "other",
];

const FEEDBACK_LABELS = {
  customer_service: "Kundenservice",
  low_quality: "Schlechte Qualität",
  missing_features: "Fehlende Funktionen",
  other: "Andere",
  switched_service: "Wechsel des Services",
  too_complex: "Zu kompliziert",
  too_expensive: "Zu teuer",
  unused: "Nicht genutzt",
};

const CancelSubscription = ({
  subscription,
  status,
}: {
  status: Stripe.Subscription.Status;
  subscription: Stripe.Subscription;
}) => {
  let { id } = subscription;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState<any | null>(null);
  const mutateSubscription = useSubscriptionUpdate(setIsModalOpen);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (status === "trialing") {
      mutateSubscription.mutate({
        subscriptionId: id,
        update: {
          //@ts-ignore
          cancellation_details: {
            feedback,
            comment,
          },
        },
      });
    }
    if (status === "active") {
      mutateSubscription.mutate({
        subscriptionId: id,
        update: {
          cancel_at_period_end: true,
          //@ts-ignore
          cancellation_details: {
            feedback,
            comment,
          },
        },
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        className="w-full"
        onClick={showModal}
        disabled={status === "canceled"}
      >
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
        okButtonProps={{
          disabled: mutateSubscription.isPending || !comment,
        }}
        okText={
          status === "trialing"
            ? "Ja, Testphase beenden"
            : "Ja, Subscription kündigen"
        }
        onOk={handleOk}
        cancelButtonProps={{ disabled: mutateSubscription.isPending }}
        onCancel={handleCancel}
      >
        <p className="pt-2">Schade, dass Du gehen möchtest!</p>
        <p className="py-2">
          Bitte teile uns mit, warum die Subscription beenden möchtest. <br />
          Damit wir unseren Service verbessern können.
        </p>
        <div className="pb-2">
          <Radio.Group name="reason">
            {FEEDBACK.map((feedback) => (
              <div key={feedback}>
                <Radio
                  id={feedback}
                  value={feedback}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFeedback(e.target.value);
                    } else {
                      setFeedback(null);
                    }
                  }}
                >
                  {FEEDBACK_LABELS[feedback as keyof typeof FEEDBACK_LABELS]}
                </Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
        <TextArea
          value={comment}
          placeholder="Dein Kommentar"
          onChange={(e) => setComment(e.currentTarget.value)}
        />
        <p>{STATUS[status].cancelMessage}</p>
        {mutateSubscription.isPending && <p>Bitte warten...</p>}
      </Modal>
    </>
  );
};

export default CancelSubscription;
