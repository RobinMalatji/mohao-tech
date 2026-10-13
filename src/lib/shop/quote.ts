export type QuoteItem = {
  productId: string;
  name: string;
  quantity: number;
  unitCents: number;
};

export type ZarQuote = {
  items: QuoteItem[];
  amountCents: number;
};

type PricedProduct = {
  id: string;
  name: string;
  prices: { ZAR: number };
};

export function quoteZar(
  lines: { id: string; qty: number }[],
  products: PricedProduct[],
): ZarQuote | null {
  if (lines.length === 0) return null;

  const items: QuoteItem[] = [];
  for (const line of lines) {
    const product = products.find((item) => item.id === line.id);
    if (!product) return null;
    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > 20) return null;
    const unitCents = product.prices.ZAR;
    if (!Number.isInteger(unitCents) || unitCents < 1) return null;
    items.push({
      productId: product.id,
      name: product.name,
      quantity: line.qty,
      unitCents,
    });
  }

  const amountCents = items.reduce(
    (sum, item) => sum + item.unitCents * item.quantity,
    0,
  );
  if (!Number.isInteger(amountCents) || amountCents < 1) return null;
  return { items, amountCents };
}
