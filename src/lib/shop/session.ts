import { cookies } from "next/headers";
import { isCurrency, type Currency } from "@/lib/shop/money";

export const currencyCookie = "mohao_currency";
export const cartCookie = "mohao_cart";

export type CartLine = {
  id: string;
  qty: number;
};

export async function getCurrency(): Promise<Currency> {
  const store = await cookies();
  const value = store.get(currencyCookie)?.value;
  return isCurrency(value) ? value : "ZAR";
}

export async function saveCart(lines: CartLine[]) {
  const store = await cookies();
  store.set(cartCookie, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function readCart(): Promise<CartLine[]> {
  const store = await cookies();
  const raw = store.get(cartCookie)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((line) => {
      if (
        !line ||
        typeof line !== "object" ||
        typeof (line as CartLine).id !== "string" ||
        typeof (line as CartLine).qty !== "number"
      ) {
        return [];
      }
      const qty = Math.floor((line as CartLine).qty);
      if (!/^[A-Z]{2,4}-\d{3}$/.test((line as CartLine).id) || qty < 1) {
        return [];
      }
      return [{ id: (line as CartLine).id, qty: Math.min(qty, 20) }];
    });
  } catch {
    return [];
  }
}
