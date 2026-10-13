import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCart } from "@/actions/shop";
import { coverPath, getProductBySlug, getProducts } from "@/lib/shop/catalogue";
import { ProductPreviewPanel } from "@/components/shop/product-preview";
import { getProductPreview } from "@/lib/shop/preview";
import { formatPrice, licenceLabel } from "@/lib/shop/money";
import { getCurrency } from "@/lib/shop/session";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/shop/p/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [currency, preview] = await Promise.all([
    getCurrency(),
    getProductPreview(product.id),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <Link
        href={`/shop/c/${product.categorySlug}`}
        className="text-sm text-muted"
      >
        {product.categoryLabel}
      </Link>
      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        <div className="bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverPath(product.id)}
            alt={`${product.name} cover`}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ember">
            {product.id}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 text-2xl tracking-[-0.03em]">
            {formatPrice(product.prices[currency], currency)}
          </p>
          <p className="mt-2 text-sm text-muted">
            Also{" "}
            {(["ZAR", "USD", "GBP", "EUR"] as const)
              .filter((code) => code !== currency)
              .map((code) => formatPrice(product.prices[code], code))
              .join(" · ")}
          </p>
          <p className="mt-6 max-w-xl leading-8 text-muted">{product.summary}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted">Type</dt>
              <dd>{product.productType}</dd>
            </div>
            <div>
              <dt className="text-muted">Licence</dt>
              <dd>{licenceLabel[product.licence] ?? product.licence}</dd>
            </div>
            <div>
              <dt className="text-muted">Version</dt>
              <dd>{product.version}</dd>
            </div>
          </dl>
          <form action={addToCart} className="mt-8">
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="btn btn-primary min-h-12 rounded-full px-6 text-sm font-medium"
            >
              Add to cart
            </button>
          </form>
          <p className="mt-4 max-w-md text-sm text-muted">
            Adding an item saves it in your cart. Payment happens on Yoco from
            the cart, in rand. The files stay private until that payment is confirmed.
          </p>
        </div>
      </div>
      {preview ? <ProductPreviewPanel preview={preview} /> : null}
      <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">What it is</h2>
          <p className="mt-4 leading-8 text-muted">{product.summary}</p>
          <p className="mt-4 leading-8 text-muted">{product.audience}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">Opens in</h2>
          <p className="mt-4 text-sm leading-7 text-muted">{product.productType}</p>
          {product.disclaimer ? (
            <p className="mt-8 text-sm leading-7 text-muted">{product.disclaimer}</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
