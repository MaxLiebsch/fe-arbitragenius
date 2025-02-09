"use client";

import Image from "next/image";
import logoSecondary from "@/images/logos/logo-secondary.svg";
import logoPrimary from "@/images/logos/logo-darkmode.svg";
import Link from "next/link";
import { useThemeAtom } from "@/hooks/use-theme";
export function Logo() {
  const [{ mode }, setApperance] = useThemeAtom();
  return (
    <Link href="/">
      <Image
        src={mode === "dark" ? logoPrimary : logoSecondary}
        priority={true}
        alt="Arbispotter"
        style={{ width: "100%", height: "auto" }}
      />
    </Link> 
  );
}
