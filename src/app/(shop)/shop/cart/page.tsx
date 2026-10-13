import type { Metadata } from "next";
import Link from "next/link";
import { updateCart } from "@/actions/shop";
import { getProductById } from "@/lib/shop/catalogue";
import { formatPrice } from "@/lib/shop/money";
import { getCurrency, readCart } from "@/lib/shop/session";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const [lines, currency] = await Promise.all([readCart(), getCurrency()]);
  const items = (
    await Promise.all(
      lines.map(async (line) => {
        const product = await getProductById(line.id);
        return product ? { product, qty: line.qty } : null;
      }),
    )
  ).filter((item) => item !== null);
  const total = items.reduce(
    (sum, item) => sum + item.product.prices[currency] * item.qty,
    0,
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="text-5xl font-semibold tracking-[-0.06em]">Cart</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-muted">
          Your cart is empty.{" "}
          <Link href="/" className="text-ink underline underline-offset-4">
            Browse the shop
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/shop/p/${item.product.slug}`}
                    className="font-medium tracking-[-0.02em]"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{item.product.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <form action={updateCart} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={item.product.id} />
                    <label className="sr-only" htmlFor={`qty-${item.product.id}`}>
                      Quantity
                    </label>
                    <input
                      id={`qty-${item.product.id}`}
                      name="qty"
                      type="number"
                      min={0}
                      max={20}
                      defaultValue={item.qty}
                      className="h-10 w-16 rounded-full border border-line bg-canvas px-3 text-sm"
                    />
                    <button type="submit" className="text-sm underline underline-offset-4">
                      Update
                    </button>
                  </form>
                  <p className="w-28 text-right text-sm">
                    {formatPrice(item.product.prices[currency] * item.qty, currency)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-right text-lg tracking-[-0.03em]">
            {formatPrice(total, currency)}
          </p>
          <div className="mt-8 border border-line bg-surface p-6">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">
              Checkout is not open
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Yoco, PayFast, and Ozow are not connected, and Apple Pay, Google
              Pay, and Samsung Pay are unavailable. This cart total is the
              catalogue price. Nothing is charged, and the product files stay
              private.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
