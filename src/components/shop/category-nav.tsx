"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CategoryNav({
  categories,
}: {
  categories: { slug: string; label: string; count: number }[];
}) {
  const pathname = usePathname();
  const allActive = pathname === "/" || pathname === "/shop";

  return (
    <nav aria-label="Product categories" className="flex flex-col gap-1 text-sm">
      <Link
        href="/"
        className={`rounded-lg px-3 py-2 ${allActive ? "bg-surface font-medium text-ink" : "text-muted hover:bg-surface hover:text-ink"}`}
        aria-current={allActive ? "page" : undefined}
      >
        All products
      </Link>
      {categories.map((category) => {
        const href = `/shop/c/${category.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={category.slug}
            href={href}
            className={`flex items-center justify-between rounded-lg px-3 py-2 ${active ? "bg-surface font-medium text-ink" : "text-muted hover:bg-surface hover:text-ink"}`}
            aria-current={active ? "page" : undefined}
          >
            <span>{category.label}</span>
            <span className="text-xs">{category.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
