"use client";

import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { recoveryAction } from "@/server/actions/recovery";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function Page({
  searchParams,
}: {
  searchParams: { email?: string; status?: "ok" | "retry" };
}) {
  const [state, formAction] = useFormState(recoveryAction, {
    message: "",
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Stelle deinen{" "}
            <span className="inline-block -mb-2">
              <Logo />
            </span>{" "}
            Account wieder her
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={formAction}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Adresse *
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@example.de"
                  required
                  defaultValue={searchParams.email}
                  disabled={searchParams.status === "ok"}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-chartreuse-yellow-700 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-row justify-between">
                <Link
                  className="text-secondary-950 underline text-sm"
                  href="/app/auth/signup"
                >
                  Ich habe keinen Account?
                </Link>
                <Link
                  className="text-secondary-950 underline text-sm"
                  href="/app/auth/signin"
                >
                  Zum Login
                </Link>
              </div>
              <Button
                type="submit"
                disabled={searchParams.status === "ok"}
                variant="solid"
                className="w-full"
                color="slate"
              >
                {searchParams.status === "retry"
                  ? "Erneut anfragen"
                  : searchParams.status === "ok"
                  ? "✓ Email versendet"
                  : "Wiederherstellung anfragen"}
              </Button>
              {searchParams.status === "ok" && (
                <div className="flex flex-row w-full justify-end">
                  <Link
                    href="/auth/recovery?status=retry"
                    className="text-secondary-950 underline text-sm"
                  >
                    Keine Email erhalten?
                  </Link>
                </div>
              )}
              {Boolean(state?.message) && (
                <div className="text-sm text-red-600 text-right">
                  ✗ {state.message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
