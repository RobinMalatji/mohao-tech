import type { ShopProduct } from "@/lib/shop/catalogue";
import { categoryBySlug } from "@/lib/shop/categories";
import type { Currency } from "@/lib/shop/money";

export const flatPriceCents = 500;

export type CatalogueRecord = {
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
  priceZar: number;
  priceUsd: number;
  priceGbp: number;
  priceEur: number;
  disclaimer: string | null;
  removed: boolean;
};

export function majorToCents(value: string) {
  const trimmed = value.trim().replace(/\s/g, "");
  const normalised =
    trimmed.includes(",") && !trimmed.includes(".")
      ? trimmed.replace(",", ".")
      : trimmed.replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(normalised)) return null;
  const cents = Math.round(Number(normalised) * 100);
  if (!Number.isInteger(cents) || cents < 1 || cents > 10_000_000) return null;
  return cents;
}

export function centsToMajor(cents: number) {
  return (cents / 100).toFixed(2);
}

export function slugifyName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function nextProductId(ids: string[]) {
  const numbers = ids
    .map((id) => /^CUS-(\d{3})$/.exec(id)?.[1])
    .filter((value): value is string => Boolean(value))
    .map((value) => Number(value));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  if (next > 999) return null;
  return `CUS-${String(next).padStart(3, "0")}`;
}

function pricesFrom(record: CatalogueRecord): Record<Currency, number> {
  return {
    ZAR: record.priceZar,
    USD: record.priceUsd,
    GBP: record.priceGbp,
    EUR: record.priceEur,
  };
}

export function recordToProduct(record: CatalogueRecord): ShopProduct {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    category: record.category,
    categorySlug: record.categorySlug,
    categoryLabel: record.categoryLabel,
    productType: record.productType,
    audience: record.audience,
    version: record.version,
    licence: record.licence,
    summary: record.summary,
    description: record.description,
    benefits: record.benefits,
    compatibility: record.compatibility,
    tags: record.tags,
    prices: pricesFrom(record),
    disclaimer: record.disclaimer ?? undefined,
  };
}

export function applyRecord(product: ShopProduct, record: CatalogueRecord): ShopProduct {
  return {
    ...product,
    ...recordToProduct(record),
    id: product.id,
  };
}

export function mergeCatalogue(files: ShopProduct[], rows: CatalogueRecord[]) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const fileIds = new Set(files.map((product) => product.id));
  const merged = files.flatMap((product) => {
    const row = byId.get(product.id);
    if (row?.removed) return [];
    return [row ? applyRecord(product, row) : product];
  });

  for (const row of rows) {
    if (row.removed || fileIds.has(row.id)) continue;
    merged.push(recordToProduct(row));
  }

  return merged.sort((a, b) => a.id.localeCompare(b.id));
}

export function productToRecord(
  product: ShopProduct,
  removed = false,
): CatalogueRecord {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    categorySlug: product.categorySlug,
    categoryLabel: product.categoryLabel,
    productType: product.productType,
    audience: product.audience,
    version: product.version,
    licence: product.licence,
    summary: product.summary,
    description: product.description,
    benefits: product.benefits,
    compatibility: product.compatibility,
    tags: product.tags,
    priceZar: product.prices.ZAR,
    priceUsd: product.prices.USD,
    priceGbp: product.prices.GBP,
    priceEur: product.prices.EUR,
    disclaimer: product.disclaimer ?? null,
    removed,
  };
}

export function withFlatPrices(product: ShopProduct): ShopProduct {
  return {
    ...product,
    prices: {
      ZAR: flatPriceCents,
      USD: flatPriceCents,
      GBP: flatPriceCents,
      EUR: flatPriceCents,
    },
  };
}

export function categoryFields(slug: string) {
  const category = categoryBySlug(slug);
  if (!category) return null;
  return {
    category: category.category,
    categorySlug: category.slug,
    categoryLabel: category.label,
  };
}
