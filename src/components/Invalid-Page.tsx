import { Logo } from "@/components/Logo";
import { SlimLayout } from "@/components/layout/SlimLayout";

export default function InvalidPage({ text }: { text: string }) {
  return (
    <SlimLayout>
      <div className="flex">
        <div className="h-10 w-auto">
          <Logo />
        </div>
      </div>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">Upps!</h1>
      <p className="mt-3 text-sm text-gray-700">{text}</p>
    </SlimLayout>
  );
}
