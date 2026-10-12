const locales = { ZAR: "en-ZA", USD: "en-US", GBP: "en-GB", EUR: "en-IE" };

export function formatMoney(cents, currency) {
  if (!Number.isInteger(cents)) throw new Error("Amount must be integer cents.");
  const locale = locales[currency];
  if (!locale) throw new Error("Currency must be ZAR, USD, GBP, or EUR.");
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}
