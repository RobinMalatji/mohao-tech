import Link from "next/link";
import type { ShopOrder } from "@/lib/admin/shop";
import { orderStatusLabels } from "@/lib/admin/shop";
import { formatDateTime } from "@/lib/format";
import { formatPrice } from "@/lib/shop/money";

export function OrderTable({ orders }: { orders: ShopOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-line px-6 py-16 text-center">
        <p className="font-medium">No orders yet.</p>
        <p className="mt-2 text-sm text-muted">
          An order appears here after someone starts checkout from the cart.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[1.4rem] border border-line">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Placed</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium"> </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-line last:border-0">
              <td className="whitespace-nowrap px-4 py-4 text-muted">
                {formatDateTime(order.createdAt)}
              </td>
              <td className="px-4 py-4">
                <p className="font-medium">
                  {order.items.map((item) => item.name).join(", ")}
                </p>
                <p className="text-muted">
                  {order.items.reduce((total, item) => total + item.quantity, 0)}{" "}
                  {order.items.reduce((total, item) => total + item.quantity, 0) === 1
                    ? "item"
                    : "items"}
                </p>
              </td>
              <td className="px-4 py-4">
                {orderStatusLabels[order.status]}
                {order.mode === "test" ? (
                  <span className="mt-1 block text-xs text-muted">Test mode</span>
                ) : null}
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                {formatPrice(order.amountCents, "ZAR")}
              </td>
              <td className="px-4 py-4 text-right">
                <Link
                  href={`/admin/shop/orders/${order.id}`}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
