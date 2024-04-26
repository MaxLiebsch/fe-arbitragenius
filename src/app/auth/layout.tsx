import { Footer } from "@/components/Footer";
import { getLoggedInUser } from "@/server/appwrite";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  if (user) redirect("/dashboard");

  return (
    <>
      {children}
      <Footer/>
    </>
  );
}
