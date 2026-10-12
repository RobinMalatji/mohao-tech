import type { Metadata } from "next";
import Link from "next/link";
import { Pager, pageNumber, pageOf } from "@/components/shop/pager";
import { ProductGrid } from "@/components/shop/product-card";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { getCurrency } from "@/lib/shop/session";

export const metadata: Metadata = {
  title: "Digital products",
  alternates: { canonical: "/shop" },
};

const pageSize = 24;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const [{ page: requested }, products, categories, currency] = await Promise.all([
    searchParams.then((params) => ({ page: pageNumber(params.page) })),
    getProducts(),
    getCategories(),
    getCurrency(),
  ]);
  const { page, pages, items } = pageOf(products, requested, pageSize);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <p className="text-[0.72rem] uppercase tracking-[0.2em] text-ember">
        Digital products
      </p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
        Ready files for work you already do.
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
        {products.length} original products across {categories.length} categories.
        Each price is set in rand, dollars, pounds, and euros. The studio site
        for software and marketing stays at{" "}
        <Link href="/" className="text-ink underline underline-offset-4">
          Mohao Tech
        </Link>
        .
      </p>
      <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <li key={category.slug} className="bg-canvas">
            <Link
              href={`/shop/c/${category.slug}`}
              className="flex h-full flex-col justify-between px-4 py-5 hover:bg-surface"
            >
              <span className="text-sm tracking-[-0.02em]">{category.label}</span>
              <span className="mt-6 text-xs text-muted">{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-16">
        <ProductGrid products={items} currency={currency} />
        <Pager
          page={page}
          pages={pages}
          hrefFor={(next) => (next === 1 ? "/shop" : `/shop?page=${next}`)}
        />
      </div>
    </main>
  );
}
