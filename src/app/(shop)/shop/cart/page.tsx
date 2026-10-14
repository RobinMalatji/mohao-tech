import type { Metadata } from "next";
import Link from "next/link";
import { startOzowCheckout, startYocoCheckout } from "@/actions/checkout";
import { updateCart } from "@/actions/shop";
import { getProductById } from "@/lib/shop/catalogue";
import { formatPrice } from "@/lib/shop/money";
import { ozowReadiness } from "@/lib/shop/ozow";
import { quoteZar } from "@/lib/shop/quote";
import { getCurrency, readCart } from "@/lib/shop/session";
import { yocoReadiness } from "@/lib/shop/yoco";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

const notices: Record<string, string> = {
  "missing-key": "Yoco is not configured on this server, so nothing was charged.",
  "missing-webhook":
    "The Yoco webhook secret is not set, so checkout stayed closed. Nothing was charged.",
  database: "The order could not be saved, so checkout did not start.",
  "yoco-error": "Yoco did not open a checkout. Nothing was charged.",
  "missing-ozow": "Ozow is not configured on this server, so nothing was charged.",
  "ozow-error": "Ozow did not open a payment page. Nothing was charged.",
  empty: "The cart has no chargeable products.",
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [{ notice }, lines, currency] = await Promise.all([
    searchParams,
    readCart(),
    getCurrency(),
  ]);
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
  const quote = quoteZar(
    items.map((item) => ({ id: item.product.id, qty: item.qty })),
    items.map((item) => item.product),
  );
  const readiness = yocoReadiness();
  const ozow = ozowReadiness();
  const noticeText = notice ? notices[notice] : undefined;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="text-5xl font-semibold tracking-[-0.06em]">Cart</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-muted">
          Your cart is empty.{" "}
          <Link href="/shop" className="text-ink underline underline-offset-4">
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
          {currency !== "ZAR" && quote ? (
            <p className="mt-2 text-right text-sm text-muted">
              Checkout charges {formatPrice(quote.amountCents, "ZAR")}, the listed rand price.
            </p>
          ) : null}
          {noticeText ? <p className="mt-6 text-sm text-ink">{noticeText}</p> : null}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Pay with Yoco</h2>
              {readiness === "ready" && quote ? (
                <>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Card payment on Yoco for {formatPrice(quote.amountCents, "ZAR")}. The
                    order is paid only after Yoco confirms it.
                  </p>
                  <form action={startYocoCheckout} className="mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary min-h-12 rounded-full px-6 text-sm font-medium"
                    >
                      Pay {formatPrice(quote.amountCents, "ZAR")} with Yoco
                    </button>
                  </form>
                </>
              ) : (
                <p className="mt-3 text-sm leading-7 text-muted">
                  {readiness === "missing-webhook"
                    ? "The Yoco webhook secret is not set, so card checkout stays closed."
                    : "The Yoco secret key is not set, so this cart cannot charge a card."}
                </p>
              )}
            </div>
            <div className="border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Pay with Ozow</h2>
              {ozow === "ready" && quote ? (
                <>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Instant EFT on Ozow for {formatPrice(quote.amountCents, "ZAR")}. Coming
                    back from Ozow does not mark the order paid. Ozow must confirm the amount.
                  </p>
                  <form action={startOzowCheckout} className="mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary min-h-12 rounded-full px-6 text-sm font-medium"
                    >
                      Pay {formatPrice(quote.amountCents, "ZAR")} with Ozow
                    </button>
                  </form>
                </>
              ) : (
                <p className="mt-3 text-sm leading-7 text-muted">
                  Ozow needs a site code, API key, and private key on this server before
                  this cart can open a bank payment. Nothing is charged until then.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
