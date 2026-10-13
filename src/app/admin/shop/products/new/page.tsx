import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Add product",
  robots: { index: false, follow: false },
};

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/shop/products" className="text-sm text-muted hover:text-ink">
          ← Catalogue
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Add product</h1>
        <p className="mt-2 text-sm text-muted">
          New products appear in the shop. They do not include a downloadable file.
        </p>
      </div>
      <ProductForm error={error} />
    </div>
  );
}
