"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { readFileProducts } from "@/lib/shop/catalogue";
import {
  categoryFields,
  flatPriceCents,
  majorToCents,
  nextProductId,
  productToRecord,
  slugifyName,
  type CatalogueRecord,
} from "@/lib/shop/catalogue-edit";

async function assertAdmin() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");
}

function refreshShop() {
  revalidatePath("/shop", "layout");
  revalidatePath("/admin/shop", "layout");
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function requireCatalogue() {
  await assertAdmin();
  if (!isDatabaseConfigured()) {
    fail("/admin/shop/products", "The product database is not available.");
  }
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function price(formData: FormData, key: string, fallback: number) {
  const raw = text(formData, key);
  if (!raw) return fallback;
  return majorToCents(raw);
}

function recordData(record: CatalogueRecord) {
  return {
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
    priceZar: record.priceZar,
    priceUsd: record.priceUsd,
    priceGbp: record.priceGbp,
    priceEur: record.priceEur,
    disclaimer: record.disclaimer,
    removed: record.removed,
  };
}

export async function saveCatalogueProduct(formData: FormData) {
  await requireCatalogue();

  const id = text(formData, "id");
  const creating = text(formData, "creating") === "1";
  const name = text(formData, "name");
  const summary = text(formData, "summary");
  const description = text(formData, "description");
  const productType = text(formData, "productType");
  const category = categoryFields(text(formData, "categorySlug"));
  const priceZar = price(formData, "priceZar", flatPriceCents);
  const priceUsd = price(formData, "priceUsd", flatPriceCents);
  const priceGbp = price(formData, "priceGbp", flatPriceCents);
  const priceEur = price(formData, "priceEur", flatPriceCents);
  const back = creating ? "/admin/shop/products/new" : `/admin/shop/products/${id}/edit`;

  if (name.length < 2 || name.length > 120) fail(back, "Enter a product name.");
  if (summary.length < 10 || summary.length > 400) {
    fail(back, "Enter a short summary, between 10 and 400 characters.");
  }
  if (description.length < 10 || description.length > 4000) {
    fail(back, "Enter a description.");
  }
  if (!category) fail(back, "Choose a category.");
  if (
    priceZar === null ||
    priceUsd === null ||
    priceGbp === null ||
    priceEur === null
  ) {
    fail(back, "Enter each price as an amount such as 5.00.");
  }

  const files = await readFileProducts();
  const existing = id
    ? await prisma.catalogueProduct.findUnique({ where: { id } })
    : null;
  const file = files.find((product) => product.id === id) ?? null;

  if (!creating && !existing && !file) fail("/admin/shop/products", "That product was not found.");

  const slugBase = slugifyName(text(formData, "slug") || name);
  if (!slugBase) fail(back, "Enter a web address name using letters and numbers.");

  const taken = await prisma.catalogueProduct.findFirst({
    where: { slug: slugBase, NOT: id ? { id } : undefined },
  });
  const fileSlugTaken = files.some(
    (product) => product.slug === slugBase && product.id !== id,
  );
  if (taken || fileSlugTaken) fail(back, "Another product already uses that address.");

  const base = existing
    ? {
        id: existing.id,
        slug: existing.slug,
        name: existing.name,
        category: existing.category,
        categorySlug: existing.categorySlug,
        categoryLabel: existing.categoryLabel,
        productType: existing.productType,
        audience: existing.audience,
        version: existing.version,
        licence: existing.licence,
        summary: existing.summary,
        description: existing.description,
        benefits: existing.benefits,
        compatibility: existing.compatibility,
        tags: existing.tags,
        prices: {
          ZAR: existing.priceZar,
          USD: existing.priceUsd,
          GBP: existing.priceGbp,
          EUR: existing.priceEur,
        },
        disclaimer: existing.disclaimer ?? undefined,
      }
    : file;

  let productId = id;
  if (creating) {
    const rows = await prisma.catalogueProduct.findMany({ select: { id: true } });
    productId =
      nextProductId([...files.map((product) => product.id), ...rows.map((row) => row.id)]) ??
      "";
    if (!productId) fail(back, "There is no free product code left.");
  }

  const record: CatalogueRecord = {
    ...(base ? productToRecord(base) : productToRecord({
      id: productId,
      slug: slugBase,
      name,
      ...category,
      productType: productType || "Digital download",
      audience: "",
      version: "1.0.0",
      licence: "personal",
      summary,
      description,
      benefits: [],
      compatibility: [],
      tags: [],
      prices: {
        ZAR: flatPriceCents,
        USD: flatPriceCents,
        GBP: flatPriceCents,
        EUR: flatPriceCents,
      },
    })),
    id: productId,
    slug: slugBase,
    name,
    ...category,
    productType: productType || base?.productType || "Digital download",
    summary,
    description,
    priceZar,
    priceUsd,
    priceGbp,
    priceEur,
    removed: false,
  };

  await prisma.catalogueProduct.upsert({
    where: { id: record.id },
    create: { id: record.id, ...recordData(record) },
    update: recordData(record),
  });

  refreshShop();
  redirect("/admin/shop/products");
}

export async function deleteCatalogueProduct(formData: FormData) {
  await requireCatalogue();
  const id = text(formData, "id");
  if (!/^[A-Z]{2,4}-\d{3}$/.test(id)) {
    fail("/admin/shop/products", "That product code is not valid.");
  }

  const files = await readFileProducts();
  const file = files.find((product) => product.id === id) ?? null;

  if (file) {
    const record = productToRecord(file, true);
    const current = await prisma.catalogueProduct.findUnique({ where: { id } });
    if (current) {
      record.slug = current.slug;
      record.name = current.name;
      record.summary = current.summary;
      record.description = current.description;
      record.priceZar = current.priceZar;
      record.priceUsd = current.priceUsd;
      record.priceGbp = current.priceGbp;
      record.priceEur = current.priceEur;
    }
    await prisma.catalogueProduct.upsert({
      where: { id },
      create: { ...recordData(record), id },
      update: { removed: true },
    });
  } else {
    await prisma.catalogueProduct.deleteMany({ where: { id } });
  }

  refreshShop();
  redirect("/admin/shop/products");
}

export async function setAllPricesToFiveRand() {
  await requireCatalogue();
  const files = await readFileProducts();
  const current = await prisma.catalogueProduct.findMany();
  const removed = new Set(current.filter((row) => row.removed).map((row) => row.id));

  for (const product of files) {
    if (removed.has(product.id)) continue;
    const saved = current.find((row) => row.id === product.id);
    const record = productToRecord(
      saved
        ? {
            id: saved.id,
            slug: saved.slug,
            name: saved.name,
            category: saved.category,
            categorySlug: saved.categorySlug,
            categoryLabel: saved.categoryLabel,
            productType: saved.productType,
            audience: saved.audience,
            version: saved.version,
            licence: saved.licence,
            summary: saved.summary,
            description: saved.description,
            benefits: saved.benefits,
            compatibility: saved.compatibility,
            tags: saved.tags,
            prices: {
              ZAR: flatPriceCents,
              USD: flatPriceCents,
              GBP: flatPriceCents,
              EUR: flatPriceCents,
            },
            disclaimer: saved.disclaimer ?? undefined,
          }
        : {
            ...product,
            prices: {
              ZAR: flatPriceCents,
              USD: flatPriceCents,
              GBP: flatPriceCents,
              EUR: flatPriceCents,
            },
          },
    );
    await prisma.catalogueProduct.upsert({
      where: { id: product.id },
      create: { ...recordData(record), id: product.id },
      update: {
        priceZar: flatPriceCents,
        priceUsd: flatPriceCents,
        priceGbp: flatPriceCents,
        priceEur: flatPriceCents,
      },
    });
  }

  await prisma.catalogueProduct.updateMany({
    where: { removed: false },
    data: {
      priceZar: flatPriceCents,
      priceUsd: flatPriceCents,
      priceGbp: flatPriceCents,
      priceEur: flatPriceCents,
    },
  });

  refreshShop();
  redirect("/admin/shop/products");
}
