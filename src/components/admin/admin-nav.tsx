"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/admin",
    label: "Enquiries",
    active: (pathname: string) =>
      pathname === "/admin" || pathname.startsWith("/admin/enquiries"),
  },
  {
    href: "/admin/shop",
    label: "Shop",
    active: (pathname: string) => pathname.startsWith("/admin/shop"),
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="flex items-center gap-1 text-sm">
      {links.map((link) => {
        const current = link.active(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 ${
              current ? "bg-surface font-medium text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
