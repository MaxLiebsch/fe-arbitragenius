import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
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
          <Logo/> 
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-dark">
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
              className="text-secondary underline text-sm"
              href="/app/auth/signup"
            >
              Ich habe keinen Account?
            </Link>
            <Link
              className="text-secondary underline text-sm"
              href="/app/auth/signin"
            >
              Zum Login
            </Link>
          </div>
          <form action={sendVerificationEmailAction}>
            <Button
              className={
                "" +
                (searchParams.status !== "ok" ? " hover:bg-primary-600" : "")
              }
              type="submit"
              disabled={searchParams.status === "ok"}
              variant="solid"
              color="slate"
            >
              {searchParams.status === "ok"
                ? "✓ Email versendet"
                : "Email erneut senden"}
            </Button>

          </form>
          {searchParams.status === "ok" && (
            <div className="flex flex-row w-full justify-end">
              <Link
                href="/auth/verify?status=retry"
                className="text-secondary underline text-sm"
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
