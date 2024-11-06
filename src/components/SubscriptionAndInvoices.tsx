import useInvoices from "@/hooks/use-invoices";
import React from "react";
import Spinner from "./Spinner";
import Invoices from "./Invoices";
import Subscription from "./Subscription";

const SubscriptionAndInvoices = () => {
  const { data, isLoading, isError } = useInvoices();
  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  if (isError) return <div>Ein Fehler ist aufgetreten</div>;

  if (data)
    return (
      <div className="gap-y-4">
        <h2 className="text-base font-semibold leading-7 text-secondary-950">
          Subscription
        </h2>
        <Subscription subscription={data.subscription} />
        <h2 className="mt-6 text-base font-semibold leading-7 text-secondary-950">
          Rechnungen
        </h2>
        <div className="w-full">
          <Invoices invoices={data.invoices.data} />
        </div>
      </div>
    );
};

export default SubscriptionAndInvoices;
