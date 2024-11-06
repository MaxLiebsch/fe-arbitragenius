import { format, fromUnixTime } from "date-fns";
import React from "react";
import Stripe from "stripe";

const Subscription = ({
  subscription,
}: {
  subscription: Stripe.Subscription;
}) => {
  //@ts-ignore
  const { start_date, id, current_period_end, current_period_start, plan } =
    subscription;
  return (
    <div>
      {plan.interval === "year" ? "Jährliche" : "Monatliche"} Subscription ({id}
      )<div>Start: {format(fromUnixTime(start_date), "dd.MM.yyyy")}</div>
      <div>
        Laufzeit: {format(fromUnixTime(current_period_start), "dd.MM.yyyy")} -{" "}
        {format(fromUnixTime(current_period_end), "dd.MM.yyyy")}
      </div>
      <div>{}</div>
    </div>
  );
};

export default Subscription;
