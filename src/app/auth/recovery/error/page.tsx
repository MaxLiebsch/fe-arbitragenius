import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function Page({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
          <Logo />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Das hat nicht geklappt! :&#40;
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm space-y-2">
          <div className="flex flex-row justify-between">
            <a
              className="text-secondary-950 underline text-sm"
              href="/auth/signup"
            >
              Du hast keinen Account?
            </a>
            <a
              className="text-secondary-950 underline text-sm"
              href="/auth/signin"
            >
              Zum Login
            </a>
          </div>
          <div>
            <Link
              href={
                Boolean(searchParams.email)
                  ? "/auth/recovery?email=" + searchParams.email
                  : "/auth/recovery"
              }
            >
              <Button variant="solid" color="slate">
                Erneut anfragen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
