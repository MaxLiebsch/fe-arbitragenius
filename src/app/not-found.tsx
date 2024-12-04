import Link from "next/link";

import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { SlimLayout } from "@/components/layout/SlimLayout";

export default function NotFound() {
  return (
    <SlimLayout>
      <div className="flex">
        <div className="h-10 w-auto">
          <Logo />
        </div>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-dark">404</p>
      <h1 className="mt-3 text-lg font-semibold text-gray-dark">
        Upps! Seite nicht gefunden
      </h1>
      <p className="mt-3 text-sm text-gray-dark">
        Leider konnten wir die gesuchte Seite nicht finden.
      </p>
      <Button href="/" className="mt-10">
        Zurück
      </Button>
    </SlimLayout>
  );
}
