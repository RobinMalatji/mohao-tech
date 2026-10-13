import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderTable } from "@/components/admin/order-table";
import { loadShopOrders } from "@/lib/admin/shop";
import { getSession } from "@/lib/auth";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { formatPrice } from "@/lib/shop/money";

export const metadata: Metadata = {
  title: "Shop",
  robots: { index: false, follow: false },
};

export default async function ShopDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [products, categories, orders] = await Promise.all([
    getProducts(),
    getCategories(),
    loadShopOrders(8),
  ]);

  const stats = [
    { label: "Products", value: String(products.length) },
    { label: "Paid orders", value: orders.available ? String(orders.counts.PAID) : "—" },
    {
      label: "Waiting for payment",
      value: orders.available ? String(orders.counts.PENDING) : "—",
    },
    {
      label: "Paid total",
      value: orders.available ? formatPrice(orders.paidCents, "ZAR") : "—",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Shop</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Orders from the cart, and the products listed at{" "}
            <Link href="/shop" className="underline underline-offset-4">
              /shop
            </Link>
            . Every product is still a draft. A paid order does not send the files.
          </p>
        </div>
        <Link
          href="/admin/shop/products"
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          View catalogue
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.4rem] border border-line p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Recent orders</h2>
          <Link
            href="/admin/shop/orders"
            className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            All orders
          </Link>
        </div>
        {orders.available ? (
          <OrderTable orders={orders.orders} />
        ) : (
          <p className="rounded-[1.4rem] border border-line px-5 py-4 text-sm text-muted">
            Orders could not be loaded from the database.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-[-0.03em]">Catalogue</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/admin/shop/products?category=${category.slug}`}
                className="flex items-center justify-between rounded-[1.2rem] border border-line px-4 py-4 hover:bg-surface"
              >
                <span>{category.label}</span>
                <span className="text-sm text-muted">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
