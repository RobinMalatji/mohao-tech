import type { Metadata } from "next";
import { ProductGrid } from "@/components/shop/product-card";
import { searchProducts } from "@/lib/shop/catalogue";
import { getCurrency } from "@/lib/shop/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (raw ?? "").slice(0, 80);
  const [products, currency] = await Promise.all([
    searchProducts(query),
    getCurrency(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <h1 className="text-4xl font-semibold tracking-[-0.05em]">Search</h1>
      <form action="/shop/search" className="mt-6">
        <label className="sr-only" htmlFor="q">
          Search products
        </label>
        <input
          id="q"
          name="q"
          defaultValue={query}
          className="h-12 w-full max-w-xl rounded-full border border-line bg-surface px-5 text-sm"
        />
      </form>
      <p className="mt-6 text-sm text-muted">
        {query
          ? `${products.length} results for “${query}”`
          : "Type a product name, category, or code."}
      </p>
      <div className="mt-10">
        <ProductGrid products={query ? products : []} currency={currency} />
      </div>
    </main>
  );
}
