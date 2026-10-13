import { access, readFile } from "node:fs/promises";
import path from "node:path";

const idPattern = /^[A-Z]{2,4}-\d{3}$/;

const contentTypes: Record<string, string> = {
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".zip": "application/zip",
  ".mjs": "text/plain; charset=utf-8",
  ".dax": "text/plain; charset=utf-8",
};

export type PackFile = {
  path: string;
  bytes: number;
};

export function isProductId(id: string) {
  return idPattern.test(id);
}

export function safeCustomerRelative(filePath: string) {
  if (!filePath || filePath.includes("\0")) return null;
  const normalised = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalised || normalised.split("/").some((part) => part === "" || part === "." || part === "..")) {
    return null;
  }
  if (!/^[A-Za-z0-9._/-]+$/.test(normalised)) return null;
  return normalised;
}

export function customerFilePath(id: string, relative: string) {
  if (!isProductId(id)) return null;
  const safe = safeCustomerRelative(relative);
  if (!safe) return null;
  const root = path.resolve(process.cwd(), "products", "library", id, "customer");
  const full = path.resolve(root, safe);
  const fromRoot = path.relative(root, full);
  if (fromRoot.startsWith("..") || path.isAbsolute(fromRoot)) return null;
  return full;
}

export function productZipPath(id: string) {
  if (!isProductId(id)) return null;
  return path.resolve(process.cwd(), "products", "library", id, `${id}.zip`);
}

export function contentTypeFor(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  return contentTypes[extension] ?? "application/octet-stream";
}

export function downloadName(filePath: string) {
  const base = path.posix.basename(filePath.replace(/\\/g, "/"));
  return base.replace(/[^A-Za-z0-9._-]/g, "");
}

export function customerMayDownload(
  order: { status: string; items: { productId: string }[] } | null,
  productId: string,
) {
  if (!order || order.status !== "PAID" || !isProductId(productId)) return false;
  return order.items.some((item) => item.productId === productId);
}

export async function readPackManifest(id: string): Promise<PackFile[]> {
  if (!isProductId(id)) return [];
  try {
    const raw = await readFile(
      path.resolve(process.cwd(), "products", "library", id, "customer", "manifest.json"),
      "utf8",
    );
    const manifest = JSON.parse(raw) as { files?: PackFile[] };
    return (manifest.files ?? []).filter(
      (file) => typeof file.path === "string" && safeCustomerRelative(file.path) && Number.isInteger(file.bytes),
    );
  } catch {
    return [];
  }
}

export async function packExists(id: string) {
  const zip = productZipPath(id);
  if (!zip) return false;
  try {
    await access(zip);
    return true;
  } catch {
    return false;
  }
}

export function fileResponse(body: Buffer, filePath: string, inline: boolean) {
  const name = downloadName(filePath) || "download";
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": contentTypeFor(filePath),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
