export const currencies = ["ZAR", "USD", "GBP", "EUR"] as const;

export type Currency = (typeof currencies)[number];

const locales: Record<Currency, string> = {
  ZAR: "en-ZA",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-IE",
};

export function isCurrency(value: string | undefined): value is Currency {
  return currencies.includes(value as Currency);
}

export function formatPrice(cents: number, currency: Currency) {
  return new Intl.NumberFormat(locales[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export const licenceLabel: Record<string, string> = {
  personal: "Personal use",
  "commercial-single": "One commercial project",
  "developer-project": "One developer project",
};
