import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProductById } from "@/lib/shop/catalogue";
import { isProductId, packExists, readPackManifest } from "@/lib/shop/deliver";

export const metadata: Metadata = {
  title: "Product files",
  robots: { index: false, follow: false },
};

export default async function ProductFilesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  if (!isProductId(id)) notFound();

  const [product, files, zip] = await Promise.all([
    getProductById(id),
    readPackManifest(id),
    packExists(id),
  ]);
  if (!product && files.length === 0 && !zip) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/shop/products" className="text-sm text-muted hover:text-ink">
            ← Catalogue
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
            {product?.name ?? id}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {id}. Open a file in the browser, or download the customer pack.
          </p>
        </div>
        {zip ? (
          <a
            href={`/api/admin/library/${id}?pack=1`}
            className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-canvas"
          >
            Download {id}.zip
          </a>
        ) : (
          <p className="text-sm text-muted">This product has no zip pack.</p>
        )}
      </div>

      {files.length === 0 ? (
        <p className="rounded-[1.4rem] border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
          No files are stored for this product.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[1.4rem] border border-line">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.path} className="border-b border-line last:border-0">
                  <td className="px-4 py-4 font-mono text-xs">{file.path}</td>
                  <td className="px-4 py-4 text-muted">{file.bytes.toLocaleString("en-ZA")} bytes</td>
                  <td className="px-4 py-4 text-right">
                    <a
                      href={`/api/admin/library/${id}?path=${encodeURIComponent(file.path)}&inline=1`}
                      className="font-medium underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                    <a
                      href={`/api/admin/library/${id}?path=${encodeURIComponent(file.path)}`}
                      className="ml-4 text-muted underline-offset-4 hover:text-ink hover:underline"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
