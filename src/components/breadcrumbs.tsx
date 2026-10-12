import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] uppercase tracking-[0.16em] text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-ink">
                  {item.name}
                </Link>
              )}
              {last ? null : (
                <span aria-hidden="true" className="text-muted/60">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
