import { headers } from "next/headers";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const status = headersList.get("subscription-status");
  const trialEnd = headersList.get("subscription-trial-end");
  const trialStart = headersList.get("subscription-trial-start");
  return (
    <DashboardLayout
      subscriptionStatus={{
        status: status,
        trialEnd: trialEnd,
        trialStart: trialStart,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
