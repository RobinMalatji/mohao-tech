"use server";

import { redirect } from "next/navigation";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { getProductById } from "@/lib/shop/catalogue";
import { quoteZar } from "@/lib/shop/quote";
import { readCart, saveCart } from "@/lib/shop/session";
import { createYocoCheckout, yocoReadiness } from "@/lib/shop/yoco";
import { getPublicOrigin } from "@/lib/site";

function cartNotice(code: string): never {
  redirect(`/shop/cart?notice=${code}`);
}

export async function startYocoCheckout() {
  const readiness = yocoReadiness();
  if (readiness !== "ready") cartNotice(readiness);
  if (!isDatabaseConfigured()) cartNotice("database");

  const lines = await readCart();
  const products = (
    await Promise.all(lines.map(async (line) => getProductById(line.id)))
  ).filter((product) => product !== null);
  const quote = quoteZar(lines, products);
  if (!quote) cartNotice("empty");

  const order = await prisma.order.create({
    data: {
      amountCents: quote.amountCents,
      currency: "ZAR",
      items: {
        create: quote.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitCents: item.unitCents,
        })),
      },
    },
  });

  const origin = getPublicOrigin();
  const checkout = await createYocoCheckout({
    amountCents: quote.amountCents,
    orderId: order.id,
    successUrl: `${origin}/shop/checkout/return?order=${order.id}&result=success`,
    cancelUrl: `${origin}/shop/checkout/return?order=${order.id}&result=cancel`,
    failureUrl: `${origin}/shop/checkout/return?order=${order.id}&result=failure`,
    lineItems: quote.items.map((item) => ({
      displayName: item.name,
      quantity: item.quantity,
      price: item.unitCents,
    })),
  });

  if (!checkout) cartNotice("yoco-error");

  await prisma.order.update({
    where: { id: order.id },
    data: { yocoCheckoutId: checkout.id, mode: checkout.mode },
  });

  redirect(checkout.redirectUrl);
}

export async function clearCartAfterPayment(orderId: string) {
  if (!isDatabaseConfigured() || !orderId) return;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });
  if (order?.status === "PAID") await saveCart([]);
}
