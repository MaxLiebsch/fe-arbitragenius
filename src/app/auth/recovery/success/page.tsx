import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
          <Logo/> 
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-dark">
            Passwort aktualisiert!
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <Link href="/auth/signin">
            <Button className="w-full" variant="solid" color="slate">
              Zurück zum Login
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
