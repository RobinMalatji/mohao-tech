import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/product-card";
import { getCategories, getProductsInCategory } from "@/lib/shop/catalogue";
import { getCurrency } from "@/lib/shop/session";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProductsInCategory(slug);
  const label = products[0]?.categoryLabel;
  if (!label) return { title: "Category" };
  return {
    title: label,
    description: `${products.length} ${label} products in the Mohao shop.`,
    alternates: { canonical: `/shop/c/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [products, currency] = await Promise.all([
    getProductsInCategory(slug),
    getCurrency(),
  ]);
  if (products.length === 0) notFound();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <Link href="/shop" className="text-sm text-muted">
        All products
      </Link>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
        {products[0].categoryLabel}
      </h1>
      <p className="mt-4 text-muted">{products.length} products</p>
      <div className="mt-12">
        <ProductGrid products={products} currency={currency} />
      </div>
    </main>
  );
}
