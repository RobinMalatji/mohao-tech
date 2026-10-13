import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { formatPrice } from "@/lib/shop/money";

export const metadata: Metadata = {
  title: "Shop catalogue",
  robots: { index: false, follow: false },
};

export default async function ShopProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const filters = await searchParams;
  const query = filters.q?.trim().toLowerCase() ?? "";
  const category = filters.category?.trim() ?? "";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const visible = products.filter((product) => {
    if (category && product.categorySlug !== category) return false;
    if (!query) return true;
    return [product.id, product.name, product.summary, product.categoryLabel]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/shop" className="text-sm text-muted hover:text-ink">
          ← Shop
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Catalogue</h1>
        <p className="mt-2 text-sm text-muted">
          {visible.length} of {products.length} products. Each one is a draft, and the
          download stays off the public page.
        </p>
      </div>

      <form action="/admin/shop/products" className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="catalogue-search">
          Search products
        </label>
        <input
          id="catalogue-search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Search name or code"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-4 text-sm outline-none"
        />
        <label className="sr-only" htmlFor="catalogue-category">
          Category
        </label>
        <select
          id="catalogue-category"
          name="category"
          defaultValue={category}
          className="h-11 rounded-xl border border-line bg-white px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 rounded-full bg-ink px-5 text-sm font-medium text-canvas"
        >
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded-[1.4rem] border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-0">
                <td className="px-4 py-4">
                  <Link
                    href={`/shop/p/${product.slug}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-muted">{product.id}</p>
                </td>
                <td className="px-4 py-4">{product.categoryLabel}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  {formatPrice(product.prices.ZAR, "ZAR")}
                </td>
                <td className="px-4 py-4 text-muted">Draft</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
