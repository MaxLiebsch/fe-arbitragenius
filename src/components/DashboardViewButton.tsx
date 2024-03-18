"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "antd";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function DashboardViewButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "table";

  return (
    <Button
      className="ml-auto"
      icon={
        view === "table" ? (
          <Squares2X2Icon className="h-6 w-6" />
        ) : (
          <ListBulletIcon className="h-6 w-6" />
        )
      }
      onClick={() =>
        router.push("/dashboard?view=" + (view === "table" ? "grid" : "table"))
      }
    />
  );
}
