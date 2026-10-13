import Link from "next/link";
import { Suspense } from "react";
import { CategoryNav } from "@/components/shop/category-nav";
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
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">Mohao</span>
            <span className="mt-1 text-lg font-semibold tracking-[-0.04em]">Products</span>
          </Link>
          <form action="/shop/search" className="hidden min-w-0 flex-1 md:block">
            <label className="sr-only" htmlFor="shop-search">
              Search products
            </label>
            <input
              id="shop-search"
              name="q"
              placeholder="Search products"
              className="h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none placeholder:text-muted"
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
            <Link href="/studio" className="hidden text-sm text-muted sm:inline">
              Studio
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-[90rem] overflow-x-auto px-5 pb-3 lg:hidden">
          <div className="flex gap-2">
            <Link href="/" className="shrink-0 rounded-full bg-surface px-3 py-1.5 text-sm">
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop/c/${category.slug}`}
                className="shrink-0 rounded-full px-3 py-1.5 text-sm text-muted"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[90rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-line px-4 py-6 lg:block">
          <CategoryNav categories={categories} />
          <p className="mt-8 px-3 text-xs leading-5 text-muted">
            Checkout does not take payment yet. Files stay private until a verified payment exists.
          </p>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Mohao digital products. Prices are listed in ZAR, USD, GBP, and EUR.</p>
          <div className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/studio">Mohao Tech studio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
