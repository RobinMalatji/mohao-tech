import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getShopOrder, orderStatusLabels } from "@/lib/admin/shop";
import { getSession } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { formatPrice } from "@/lib/shop/money";

export const metadata: Metadata = {
  title: "Shop order",
  robots: { index: false, follow: false },
};

export default async function ShopOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const order = await getShopOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/shop/orders" className="text-sm text-muted hover:text-ink">
          ← All orders
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          {orderStatusLabels[order.status]}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Placed {formatDateTime(order.createdAt)}
          {order.paidAt ? ` · Paid ${formatDateTime(order.paidAt)}` : ""}
        </p>
      </div>

      <dl className="grid gap-4 rounded-[1.4rem] border border-line p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Total</dt>
          <dd className="mt-1">{formatPrice(order.amountCents, "ZAR")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Mode</dt>
          <dd className="mt-1">{order.mode === "test" ? "Test" : order.mode === "live" ? "Live" : "Not sent to Yoco yet"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Order</dt>
          <dd className="mt-1 break-all font-mono text-sm">{order.id}</dd>
        </div>
      </dl>

      <div className="overflow-x-auto rounded-[1.4rem] border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-4 py-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted">{item.productId}</p>
                </td>
                <td className="px-4 py-4">{item.quantity}</td>
                <td className="px-4 py-4">{formatPrice(item.unitCents, "ZAR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted">
        The product files stay private. This page does not send a download.
      </p>
    </div>
  );
}
