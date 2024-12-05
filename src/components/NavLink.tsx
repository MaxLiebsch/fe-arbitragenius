import Link from "next/link";

export function NavLink({
  href,
  target,
  children,
}: {
  href: string;
  target?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={target}
      className="inline-block rounded-lg hover:px-2 py-1 text-sm text-secondary hover:bg-slate-100 dark:hover:bg-gray-700"
    >
      {children}
    </Link>
  );
}
