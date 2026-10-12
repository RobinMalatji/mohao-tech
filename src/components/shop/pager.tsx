import Link from "next/link";

export function Pager({
  page,
  pages,
  hrefFor,
}: {
  page: number;
  pages: number;
  hrefFor: (page: number) => string;
}) {
  if (pages <= 1) return null;

  return (
    <nav aria-label="Pages" className="mt-12 flex items-center gap-4 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="underline underline-offset-4">
          Previous
        </Link>
      ) : (
        <span className="text-muted">Previous</span>
      )}
      <span>
        {page} / {pages}
      </span>
      {page < pages ? (
        <Link href={hrefFor(page + 1)} className="underline underline-offset-4">
          Next
        </Link>
      ) : (
        <span className="text-muted">Next</span>
      )}
    </nav>
  );
}

export function pageOf<T>(items: T[], page: number, size: number) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(page, 1), pages);
  const start = (current - 1) * size;
  return {
    page: current,
    pages,
    items: items.slice(start, start + size),
  };
}

export function pageNumber(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
