import { format, fromUnixTime, sub } from "date-fns";
import React, { useEffect, useState } from "react";
import Stripe from "stripe";
import Badge, { Color } from "./Badge";
import { useSubscriptionUpdate } from "@/hooks/use-subscription-update";
import { Button } from "./Button";
import { message, Modal } from "antd";
import CancelSubscription from "./CancelSubscription";
import ContinueSubscription from "./ContinueSubscription";
import SwitchSubscription from "./SwithchSubscription";

export const STATUS: {
  [key in Stripe.Subscription.Status]: {
    text: string;
    cancelMessage?: string;
    continueMessage?: string;
    yearToMonthMessage?: string;
    monthToYearMessage?: string;
    switchSubscriptionMessage?: string;
    color: Color;
  };
} = {
  active: {
    text: "Aktiv",
    yearToMonthMessage:
      "Möchtest Du dein Subscription in eine monatliche Subscription umwandeln?",
    monthToYearMessage:
      "Möchtest Du dein Subscription in eine jährlich Subscription umwandeln?",
    switchSubscriptionMessage:
      "Der Wechsel geschieht automatisch zum Ende der aktuellen Subscription.",
    cancelMessage:
      "Bist Du sicher, dass du deine Subscription beenden möchtest?",
    color: "green",
  },
  canceled: {
    text: "Gekündigt",
    continueMessage:
      "Wie wunderbar! Bestätige hiermit, dass Du deine Subscription verlängern möchtest.",
    color: "gray",
  },
  incomplete: { text: "Unvollständig", color: "green" },
  incomplete_expired: { text: "Unvollständig abgelaufen", color: "green" },
  past_due: { text: "Überfällig", color: "green" },
  trialing: {
    text: "Testphase",
    monthToYearMessage:
      "Möchtest Du dein Subscription in eine jährlich Subscription umwandeln?",
    switchSubscriptionMessage:
      "Der Wechsel geschieht automatisch zum Ende der aktuellen Subscription.",
    cancelMessage: "Bist Du sicher, dass du deine Testphase beenden möchtest?",
    color: "green",
  },
  unpaid: { text: "Unbezahlt", color: "green" },
  paused: { text: "Pausiert", color: "green" },
};

const Subscription = ({
  subscription,
}: {
  subscription: Stripe.Subscription;
}) => {
  const {
    id,
    current_period_end,
    cancel_at,
    canceled_at,
    current_period_start,
    //@ts-ignore
    plan,
  } = subscription;
  const [status, setStatus] = useState<Stripe.Subscription.Status>(
    subscription.status
  );
  const interval = plan.interval;

  useEffect(() => {
    if (subscription.cancel_at_period_end === true) {
      setStatus("canceled");
    } else {
      setStatus(subscription.status);
    }
  }, [subscription]);

  return (
    <div className="grid grid-cols-6">
      <div className="col-span-5">
        <div className="gap-x-4 flex">
          <Badge text={STATUS[status].text} color={STATUS[status].color} />
          {plan.interval === "year" ? "Jährliche" : "Monatliche"} Subscription (
          {id})
        </div>
        {subscription.schedule && (
          <div>
            Wechsel zum Jahresabo am:{" "}
            {format(
              fromUnixTime(
                (
                  subscription.schedule as unknown as Stripe.SubscriptionSchedule
                ).current_phase?.end_date!
              ),
              "dd.MM.yyyy"
            )}
          </div>
        )}
        <div>
          Laufzeit: {format(fromUnixTime(current_period_start), "dd.MM.yyyy")} -{" "}
          {format(fromUnixTime(current_period_end), "dd.MM.yyyy")}
        </div>
        {status === "canceled" && cancel_at && canceled_at ? (
          <>
            <div>
              Kündigung eingereicht am:{" "}
              {format(fromUnixTime(canceled_at), "dd.MM.yyyy")}
            </div>
            <div>
              Kündigung zum: {format(fromUnixTime(cancel_at), "dd.MM.yyyy")}
            </div>
          </>
        ) : null}
      </div>

      <div className="flex flex-col justify-end items-end">
        {status === "trialing" || status === "active" ? (
          <div className="flex flex-col gap-1 items-center">
            {interval === "month" && !subscription.schedule ? (
              <SwitchSubscription status={status} subscription={subscription} />
            ) : null}
            <CancelSubscription status={status} subscription={subscription} />
          </div>
        ) : null}
        {status === "canceled" ? (
          <ContinueSubscription status={status} subscription={subscription} />
        ) : null}
      </div>
    </div>
  );
};

export default Subscription;
