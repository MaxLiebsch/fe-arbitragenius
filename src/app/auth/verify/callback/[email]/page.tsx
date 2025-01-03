"use server";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { createSessionClient } from "@/server/appwrite";
import logger from "@/util/logger";
import { createWebClient } from "@/web/appwrite";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: { email: string };
  searchParams: {
    userId?: string;
    secret?: string;
    expire?: string;
  };
}) {
  if (!searchParams.userId || !searchParams.secret || !searchParams.expire) {
    redirect("/auth/verify");
  }

  try {
    const { account } = await createSessionClient();
    await account.updateVerification(searchParams.userId, searchParams.secret);

    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
            <Logo />
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-dark">
              Account verifiziert!
            </h2>
          </div>
          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            <Link href="/app">
              <Button className="w-full" variant="solid" color="slate">
                Zum Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  } catch (error) {
    logger.error(`Error verifying account: ${error}`);
    try {
      const { account } = await createWebClient();
      await account.updateVerification(
        searchParams.userId,
        searchParams.secret
      );
      return (
        <>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
              <Logo />
              <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-dark">
                Account verifiziert!
              </h2>
            </div>
            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
              <Link href="/auth/signin">
                <Button className="w-full" variant="solid" color="slate">
                  Zum Login
                </Button>
              </Link>
            </div>
          </div>
        </>
      );
    } catch (error) {
      logger.error(`Error verifying account: ${error}`);
      redirect("/auth/verify");
    }
  }
}
