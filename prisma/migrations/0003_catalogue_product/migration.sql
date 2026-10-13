-- CreateTable
CREATE TABLE "CatalogueProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "categoryLabel" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT '',
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "licence" TEXT NOT NULL DEFAULT 'personal',
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "benefits" TEXT[],
    "compatibility" TEXT[],
    "tags" TEXT[],
    "priceZar" INTEGER NOT NULL,
    "priceUsd" INTEGER NOT NULL,
    "priceGbp" INTEGER NOT NULL,
    "priceEur" INTEGER NOT NULL,
    "disclaimer" TEXT,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogueProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CatalogueProduct_slug_key" ON "CatalogueProduct"("slug");
