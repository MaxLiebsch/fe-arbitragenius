import Link from "next/link";
import { ReactNode } from "react";

export const LinkWrapper = (
  link: string | undefined,
  name?: string,
  mnfctr?: string
): ReactNode => {
  const regexp = /https?:\/\/[^?#\n?]+(?:\?[^#\n?]+)?(?:#[^#\n?]+)?/;
  if (link) {
    const match = link.match(regexp);
    if (!match) return <></>;

    return (
      <Link
        href={match[0]}
        target="_blank"
        className="font-light hover:font-semibold"
      >
        <div className="leading-2">
          {mnfctr ? `${mnfctr} ` : ""}
          {name ? name : "Visit"}
        </div>
      </Link>
    );
  } else {
    return <></>;
  }
};
