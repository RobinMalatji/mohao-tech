import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { currencies, type Currency } from "@/lib/shop/money";

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  categoryLabel: string;
  productType: string;
  audience: string;
  version: string;
  licence: string;
  summary: string;
  description: string;
  benefits: string[];
  compatibility: string[];
  tags: string[];
  prices: Record<Currency, number>;
  disclaimer?: string;
};

export type ShopCategory = {
  slug: string;
  label: string;
  count: number;
};

export type IncludedFile = {
  path: string;
  bytes: number;
};

const libraryRoot = path.join(process.cwd(), "products", "library");
const idPattern = /^[A-Z]{2,4}-\d{3}$/;

export const getProducts = cache(async (): Promise<ShopProduct[]> => {
  const entries = await readdir(libraryRoot);
  const ids = entries.filter((name) => idPattern.test(name));
  const products = await Promise.all(
    ids.map(async (id) => {
      const raw = await readFile(
        path.join(libraryRoot, id, "internal", "meta.json"),
        "utf8",
      );
      return JSON.parse(raw) as ShopProduct;
    }),
  );

  return products.sort((a, b) => a.id.localeCompare(b.id));
});

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? null;
}

export async function getCategories(): Promise<ShopCategory[]> {
  const products = await getProducts();
  const categories = new Map<string, ShopCategory>();

  for (const product of products) {
    const current = categories.get(product.categorySlug);
    if (current) {
      current.count += 1;
    } else {
      categories.set(product.categorySlug, {
        slug: product.categorySlug,
        label: product.categoryLabel,
        count: 1,
      });
    }
  }

  const order = [
    "personal-finance",
    "design-templates",
    "notion-systems",
    "analytics-dashboards",
    "guides",
    "ai-prompt-packs",
    "cv-kits",
    "ecommerce-kits",
    "courses",
    "developer-products",
  ];

  return [...categories.values()].sort(
    (a, b) => order.indexOf(a.slug) - order.indexOf(b.slug),
  );
}

export async function getProductsInCategory(slug: string) {
  const products = await getProducts();
  return products.filter((product) => product.categorySlug === slug);
}

export async function searchProducts(query: string) {
  const needle = query.trim().toLowerCase();
  const products = await getProducts();
  if (!needle) return products;

  return products.filter((product) => {
    const haystack = [
      product.id,
      product.name,
      product.summary,
      product.categoryLabel,
      product.productType,
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export async function getIncludedFiles(id: string): Promise<IncludedFile[]> {
  if (!idPattern.test(id)) return [];

  const raw = await readFile(
    path.join(libraryRoot, id, "customer", "manifest.json"),
    "utf8",
  );
  const manifest = JSON.parse(raw) as { files?: IncludedFile[] };
  return (manifest.files ?? []).filter(
    (file) => !file.path.startsWith("preview/"),
  );
}

export function coverPath(id: string) {
  return `/shop/covers/${id}`;
}

export function priceFor(product: ShopProduct, currency: Currency) {
  const cents = product.prices[currency];
  if (!Number.isInteger(cents) || cents <= 0) {
    throw new Error(`Missing ${currency} price for ${product.id}`);
  }
  return cents;
}

export const shopCurrencies = currencies;
