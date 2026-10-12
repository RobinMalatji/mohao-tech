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
      <div className="aspect-square overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverPath(product.id)}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <p className="mt-4 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        {product.categoryLabel}
      </p>
      <h2 className="mt-1 text-base font-medium tracking-[-0.03em] group-hover:underline group-hover:decoration-ember group-hover:underline-offset-4">
        {product.name}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {formatPrice(product.prices[currency], currency)}
      </p>
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
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} currency={currency} />
      ))}
    </div>
  );
}
