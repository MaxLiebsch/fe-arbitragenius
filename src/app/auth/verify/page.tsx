import { sendVerificationEmailAction } from "@/server/actions/send-verification-email";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: { status?: "ok" | "retry" };
}) {
  if (!searchParams.status) {
    await sendVerificationEmailAction();
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 space-y-5">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
          <img
            className="mx-auto h-10 w-auto"
            src="/static/arbispotter_left-black.png"
            alt="Arbispotter"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Account Verifizieren
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          Es wurde eine Verifizierungs-Email gesendet. Bitte öffnen Sie den in
          der Email enthaltenen Link um ihren Account zu verifizieren.
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-2">
          <div className="flex flex-row justify-between">
            <Link
              className="text-blue-500 underline text-sm"
              href="/auth/signup"
            >
              Ich habe keinen Account?
            </Link>
            <Link
              className="text-blue-500 underline text-sm"
              href="/auth/signin"
            >
              Zum Login
            </Link>
          </div>
          <form action={sendVerificationEmailAction}>
            <button
              type="submit"
              disabled={searchParams.status === "ok"}
              className={
                "flex w-full justify-center rounded-md bg-chartreuse-yellow-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse-yellow-700" +
                (searchParams.status !== "ok"
                  ? " hover:bg-chartreuse-yellow-600"
                  : "")
              }
            >
              {searchParams.status === "ok"
                ? "✓ Email versendet"
                : "Email erneut senden"}
            </button>
          </form>
          {searchParams.status === "ok" && (
            <div className="flex flex-row w-full justify-end">
              <Link
                href="/auth/verify?status=retry"
                className="text-blue-500 underline text-sm"
              >
                Keine Email erhalten?
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
