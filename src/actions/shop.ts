"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProductById } from "@/lib/shop/catalogue";
import { isCurrency } from "@/lib/shop/money";
import { cartCookie, currencyCookie, readCart } from "@/lib/shop/session";

function safeNext(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/shop")) return "/shop";
  if (value.startsWith("//") || value.includes("\\")) return "/shop";
  return value;
}

export async function setCurrency(formData: FormData) {
  const value = formData.get("currency");
  if (typeof value === "string" && isCurrency(value)) {
    const store = await cookies();
    store.set(currencyCookie, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  redirect(safeNext(formData.get("next")));
}

async function writeCart(lines: { id: string; qty: number }[]) {
  const store = await cookies();
  store.set(cartCookie, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function addToCart(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") redirect("/shop");
  const product = await getProductById(id);
  if (!product) redirect("/shop");

  const cart = await readCart();
  const existing = cart.find((line) => line.id === id);
  if (existing) {
    existing.qty = Math.min(existing.qty + 1, 20);
  } else {
    cart.push({ id, qty: 1 });
  }
  await writeCart(cart);
  redirect("/shop/cart");
}

export async function updateCart(formData: FormData) {
  const id = formData.get("id");
  const qty = Number(formData.get("qty"));
  if (typeof id !== "string") redirect("/shop/cart");

  const cart = await readCart();
  const next = cart.flatMap((line) => {
    if (line.id !== id) return [line];
    if (!Number.isInteger(qty) || qty < 1) return [];
    return [{ id, qty: Math.min(qty, 20) }];
  });
  await writeCart(next);
  redirect("/shop/cart");
}
