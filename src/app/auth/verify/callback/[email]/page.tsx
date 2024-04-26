"use server";

import { Client, Account } from "appwrite";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { createSessionClient } from "@/server/appwrite";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/web/appwrite";

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
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Account verifiziert!
            </h2>
          </div>
          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            <Link href="/">
              <Button className="w-full" variant="solid" color="slate">
                Zum Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.log(error);
    try {
      const client = createClient();
      const account = new Account(client);

      await account.updateVerification(
        searchParams.userId,
        searchParams.secret
      );
      return (
        <>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
              <Logo />
              <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
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
      console.log('error:', error)
      redirect("/auth/verify");
    }
  }
}
