import { useQuery } from "@tanstack/react-query";
import Stripe from "stripe";

type UseInvoiceResponse = {
  invoices: Pick<Stripe.Response<Stripe.ApiList<Stripe.Invoice>>, "data">;
  subscription: Stripe.Response<Stripe.Subscription>;
};

export default function useInvoices() {
  return useQuery<UseInvoiceResponse>({
    queryKey: ["user", "invoices"],
    queryFn: () => fetch(`/app/api/user/invoices`).then((resp) => resp.json()),
  });
}
