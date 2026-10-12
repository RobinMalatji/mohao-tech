"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { setCurrency } from "@/actions/shop";
import { currencies, type Currency } from "@/lib/shop/money";

export function CurrencySwitch({ current }: { current: Currency }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const query = search.toString();
  const next = query ? `${pathname}?${query}` : pathname;

  return (
    <form action={setCurrency}>
      <input type="hidden" name="next" value={next} />
      <label className="sr-only" htmlFor="shop-currency">
        Currency
      </label>
      <select
        id="shop-currency"
        name="currency"
        defaultValue={current}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-10 rounded-full border border-line bg-canvas px-3 text-sm text-ink"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </form>
  );
}
