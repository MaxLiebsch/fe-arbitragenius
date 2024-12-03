import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export const useSubscriptionSwitch = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      update,
    }: {
      subscriptionId: string;
      update: { newInterval: "month" | "year" };
    }) => {
      const response = await fetch(
        `/app/api/user/subscriptions/switch?subscriptionId=${subscriptionId}`,
        {
          method: "POST",
          body: JSON.stringify(update),
        }
      );

      if (!response.ok) throw new Error(await response.text());
      return await response.text();
    },
    onSettled: async (data) => {
      message.success(data);
      await queryClient.invalidateQueries({ queryKey: ["user", "invoices"] });
      setIsModalOpen(false);
    },
  });
};
