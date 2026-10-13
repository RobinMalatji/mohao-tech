import Link from "next/link";
import type { ShopProduct } from "@/lib/shop/catalogue";
import { formatPrice, type Currency } from "@/lib/shop/money";

export function ProductCard({
  product,
  currency,
}: {
  product: ShopProduct;
  currency: Currency;
}) {
  return (
    <Link href={`/shop/p/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-line bg-white transition-colors group-hover:border-ink/25">
        <div className="bg-[#f4f3ef]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/shop/snapshots/${product.id}`}
            alt=""
            className="aspect-[16/10] w-full object-cover object-top"
          />
        </div>
        <div className="flex items-start justify-between gap-3 px-3 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-medium tracking-[-0.02em]">{product.name}</h2>
            <p className="mt-1 text-sm text-muted">{product.categoryLabel}</p>
          </div>
          <p className="shrink-0 text-sm">{formatPrice(product.prices[currency], currency)}</p>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  currency,
}: {
  products: ShopProduct[];
  currency: Currency;
}) {
  if (products.length === 0) {
    return <p className="text-muted">No products match this view.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} currency={currency} />
      ))}
    </div>
  );
}
