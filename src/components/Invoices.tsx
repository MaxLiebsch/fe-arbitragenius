import React from "react";
import Stripe from "stripe";
import { Button } from "./Button";
import { format, fromUnixTime } from "date-fns";
import { formatCurrency, formatter } from "@/util/formatter";

const PaymentStati: { [key in Stripe.Invoice.Status]: string } = {
  draft: "Entwurf",
  open: "Offen",
  paid: "Bezahlt",
  uncollectible: "Nicht einziehbar",
  void: "Leer",
};

const Invoices = ({ invoices }: { invoices: Stripe.Invoice[] }) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {invoices.map((invoice) => {
        const {
          amount_paid,
          total,
          id,
          invoice_pdf,
          status,
          period_end,
          period_start,
        } = invoice;

        return (
          <li
            key={id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">{id}</div>
              <p className="mt-1 flex text-xs/5 text-gray-500">
                {format(fromUnixTime(period_start), "dd.MM.yyyy")}-
                {format(fromUnixTime(period_end), "dd.MM.yyyy")}
              </p>
              <div>{status && PaymentStati[status]}</div>
            </div>
            <div>
              <div className="flex items-start gap-x-3">Rechungsbetrag</div>
              <p className="text-sm/5 font-medium text-gray-900">
                {total ? formatCurrency(total / 100) : formatter.format(0)}
              </p>
            </div>
            {invoice_pdf && (
              <Button href={invoice_pdf} target="_blank">
                Rechnung herunterladen
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Invoices;
