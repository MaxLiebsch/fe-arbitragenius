import Link from "next/link";

import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { SlimLayout } from "@/components/layout/SlimLayout";

export default function NotFound() {
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <div className="h-10 w-auto">
            <Logo />
          </div>
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-700">404</p>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
        Upps! Seite nicht gefunden
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        Leider konnten wir die gesuchte Seite nicht finden.
      </p>
      <Button href="/" className="mt-10">
        Zurück
      </Button>
    </SlimLayout>
  );
}
