import Link from "next/link";
import { coverPath, type ShopProduct } from "@/lib/shop/catalogue";
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
      <div className="rounded-2xl border border-line bg-white p-3 transition-colors group-hover:border-ink/25">
        <div className="overflow-hidden rounded-xl bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverPath(product.id)}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <h2 className="mt-3 text-sm font-medium tracking-[-0.02em]">{product.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{product.summary}</p>
        <p className="mt-3 text-sm">{formatPrice(product.prices[currency], currency)}</p>
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
