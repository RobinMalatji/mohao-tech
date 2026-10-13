import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { getCurrency } from "@/lib/shop/session";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Mohao digital products: finance workbooks, design kits, Notion systems, analytics packs, guides, prompt packs, CV kits, e-commerce kits, courses, and developer tools.",
  alternates: { canonical: "/shop" },
};

export default async function GalleryPage() {
  const [products, categories, currency] = await Promise.all([
    getProducts(),
    getCategories(),
    getCurrency(),
  ]);

  return (
    <main className="px-5 py-8 sm:px-8">
      <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Products</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
        {products.length} products across {categories.length} categories. Open a card to see the product.
      </p>
      <form action="/shop/search" className="mt-6">
        <label className="sr-only" htmlFor="gallery-search">
          Search products
        </label>
        <input
          id="gallery-search"
          name="q"
          placeholder="Search products"
          className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none placeholder:text-muted"
        />
      </form>
      <div className="mt-12 space-y-14">
        {categories.map((category) => {
          const items = products
            .filter((product) => product.categorySlug === category.slug)
            .slice(0, 4);
          return (
            <section key={category.slug}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-[-0.03em]">{category.label}</h2>
                <Link
                  href={`/shop/c/${category.slug}`}
                  className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  See all {category.count}
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} currency={currency} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
