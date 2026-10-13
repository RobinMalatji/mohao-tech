import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getSession } from "@/lib/auth";
import { getProductById } from "@/lib/shop/catalogue";

export const metadata: Metadata = {
  title: "Edit product",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const { error } = await searchParams;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/shop/products" className="text-sm text-muted hover:text-ink">
          ← Catalogue
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Edit {product.id}</h1>
      </div>
      <ProductForm product={product} error={error} />
    </div>
  );
}
