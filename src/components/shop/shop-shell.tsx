import Link from "next/link";
import { Suspense } from "react";
import { CurrencySwitch } from "@/components/shop/currency-switch";
import { getCategories } from "@/lib/shop/catalogue";
import { getCurrency, readCart } from "@/lib/shop/session";

export async function ShopShell({ children }: { children: React.ReactNode }) {
  const [categories, currency, cart] = await Promise.all([
    getCategories(),
    getCurrency(),
    readCart(),
  ]);
  const count = cart.reduce((total, line) => total + line.qty, 0);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/shop" className="flex flex-col leading-none">
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
              Mohao
            </span>
            <span className="mt-1 text-lg font-semibold tracking-[-0.04em]">
              Shop
            </span>
          </Link>
          <form action="/shop/search" className="hidden min-w-0 flex-1 md:block">
            <label className="sr-only" htmlFor="shop-search">
              Search products
            </label>
            <input
              id="shop-search"
              name="q"
              placeholder="Search the catalogue"
              className="h-11 w-full rounded-full border border-line bg-surface px-5 text-sm outline-none placeholder:text-muted"
            />
          </form>
          <div className="flex items-center gap-3">
            <Suspense fallback={null}>
              <CurrencySwitch current={currency} />
            </Suspense>
            <Link
              href="/shop/cart"
              className="text-sm tracking-[-0.01em] underline decoration-ember decoration-2 underline-offset-4"
            >
              Cart{count > 0 ? ` (${count})` : ""}
            </Link>
            <Link href="/" className="hidden text-sm text-muted sm:inline">
              Studio
            </Link>
          </div>
        </div>
        <nav
          aria-label="Product categories"
          className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-5 pb-4 text-sm sm:px-8"
        >
          <Link href="/shop" className="shrink-0 text-ink">
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/c/${category.slug}`}
              className="shrink-0 text-muted hover:text-ink"
            >
              {category.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="border-b border-line bg-surface">
        <p className="mx-auto max-w-7xl px-5 py-3 text-sm text-muted sm:px-8">
          Catalogue preview of finished digital products. Checkout does not take
          payment yet, and files are not released until a verified payment exists.
        </p>
      </div>
      {children}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Mohao digital products. Prices are listed in ZAR, USD, GBP, and EUR.</p>
          <div className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/">Mohao Tech studio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
