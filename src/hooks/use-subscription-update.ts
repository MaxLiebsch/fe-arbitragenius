import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import Stripe from "stripe";

export const useSubscriptionUpdate = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      update,
    }: {
      subscriptionId: string;
      update: Partial<Stripe.Subscription>;
    }) => {
      const response = await fetch(
        `/app/api/user/subscriptions?subscriptionId=${subscriptionId}`,
        {
          method: "POST",
          body: JSON.stringify(update),
        }
      );

      if (!response.ok) throw new Error(await response.text());
      return await response.text();
    },
    onSettled: async (data, error, variables) => {
      if (variables?.update?.cancel_at_period_end === false) {
        message.success(data);
        await queryClient.invalidateQueries({ queryKey: ["user", "invoices"] });
        setIsModalOpen(false);
      } else {
        window.location.reload();
      }
    },
  });
};
