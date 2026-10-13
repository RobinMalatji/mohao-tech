import { saveCatalogueProduct } from "@/actions/catalogue";
import { shopCategories } from "@/lib/shop/categories";
import { centsToMajor } from "@/lib/shop/catalogue-edit";
import type { ShopProduct } from "@/lib/shop/catalogue";

const field =
  "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none";

export function ProductForm({
  product,
  error,
}: {
  product?: ShopProduct;
  error?: string;
}) {
  const creating = !product;

  return (
    <form action={saveCatalogueProduct} className="max-w-2xl space-y-5">
      <input type="hidden" name="creating" value={creating ? "1" : "0"} />
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {error ? (
        <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">{error}</p>
      ) : null}
      <label className="block text-sm">
        Name
        <input name="name" required defaultValue={product?.name ?? ""} className={`${field} mt-2`} />
      </label>
      <label className="block text-sm">
        Address
        <input
          name="slug"
          defaultValue={product?.slug ?? ""}
          placeholder="household-monthly-budget"
          className={`${field} mt-2`}
        />
      </label>
      <label className="block text-sm">
        Category
        <select
          name="categorySlug"
          defaultValue={product?.categorySlug ?? "personal-finance"}
          className={`${field} mt-2`}
        >
          {shopCategories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Summary
        <textarea
          name="summary"
          required
          rows={3}
          defaultValue={product?.summary ?? ""}
          className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="block text-sm">
        Description
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={product?.description ?? ""}
          className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="block text-sm">
        Type
        <input
          name="productType"
          defaultValue={product?.productType ?? "Digital download"}
          className={`${field} mt-2`}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <PriceField name="priceZar" label="Price (ZAR)" cents={product?.prices.ZAR ?? 500} />
        <PriceField name="priceUsd" label="Price (USD)" cents={product?.prices.USD ?? 500} />
        <PriceField name="priceGbp" label="Price (GBP)" cents={product?.prices.GBP ?? 500} />
        <PriceField name="priceEur" label="Price (EUR)" cents={product?.prices.EUR ?? 500} />
      </div>
      <button type="submit" className="h-11 rounded-full bg-ink px-5 text-sm font-medium text-canvas">
        {creating ? "Add product" : "Save changes"}
      </button>
    </form>
  );
}

function PriceField({
  name,
  label,
  cents,
}: {
  name: string;
  label: string;
  cents: number;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        name={name}
        inputMode="decimal"
        defaultValue={centsToMajor(cents)}
        className={`${field} mt-2`}
      />
    </label>
  );
}
