import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearPaidCart } from "@/components/shop/clear-paid-cart";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { packExists } from "@/lib/shop/deliver";
import { formatPrice } from "@/lib/shop/money";

export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
};

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; result?: string }>;
}) {
  const { order: orderId, result } = await searchParams;
  if (!orderId || !isDatabaseConfigured()) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  const paid = order.status === "PAID";
  const downloads = paid
    ? await Promise.all(
        [...new Map(order.items.map((item) => [item.productId, item])).values()].map(async (item) => ({
          id: item.productId,
          name: item.name,
          ready: await packExists(item.productId),
        })),
      )
    : [];
  const heading = paid
    ? "Payment confirmed"
    : result === "cancel"
      ? "Payment not completed"
      : result === "failure"
        ? "Payment failed"
        : "Waiting for Yoco";
  const detail = paid
    ? "Yoco confirmed this payment. Download each file below. This page keeps the links."
    : "Returning from Yoco does not mark an order paid. The charge is confirmed only by a signed Yoco webhook, and the files stay private until then.";

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      {paid ? <ClearPaidCart orderId={order.id} /> : null}
      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ember">Yoco</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-[-0.06em]">{heading}</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted">{detail}</p>
      <p className="mt-6 text-lg tracking-[-0.03em]">
        {formatPrice(order.amountCents, "ZAR")}
        {order.mode === "test" ? " · test mode" : ""}
      </p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4 text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.unitCents * item.quantity, "ZAR")}</span>
          </li>
        ))}
      </ul>
      {downloads.length > 0 ? (
        <div className="mt-8 space-y-3">
          {downloads.map((item) =>
            item.ready ? (
              <a
                key={item.id}
                href={`/api/shop/download/${order.id}/${item.id}`}
                className="flex h-12 items-center justify-between rounded-full bg-ink px-5 text-sm font-medium text-canvas"
              >
                <span>Download {item.name}</span>
                <span>{item.id}.zip</span>
              </a>
            ) : (
              <p key={item.id} className="text-sm text-muted">
                {item.name} has no file stored.
              </p>
            ),
          )}
        </div>
      ) : null}
      <p className="mt-4 text-sm text-muted">Order {order.id}</p>
      <Link href="/shop/cart" className="mt-8 inline-block text-sm underline underline-offset-4">
        Back to the cart
      </Link>
    </main>
  );
}
