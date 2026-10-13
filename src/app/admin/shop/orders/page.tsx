import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderTable } from "@/components/admin/order-table";
import { loadShopOrders } from "@/lib/admin/shop";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Shop orders",
  robots: { index: false, follow: false },
};

export default async function ShopOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const orders = await loadShopOrders(100);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/shop" className="text-sm text-muted hover:text-ink">
          ← Shop
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Orders</h1>
        <p className="mt-2 text-sm text-muted">
          The latest 100 checkouts. Paid means Yoco confirmed the amount.
        </p>
      </div>
      {!orders.available ? (
        <p className="rounded-[1.4rem] border border-line px-5 py-4 text-sm text-muted">
          Orders could not be loaded from the database.
        </p>
      ) : (
        <OrderTable orders={orders.orders} />
      )}
    </div>
  );
}
