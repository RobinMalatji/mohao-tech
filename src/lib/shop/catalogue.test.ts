import { describe, expect, it } from "vitest";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { currencies, formatPrice } from "@/lib/shop/money";

describe("shop catalogue", () => {
  it("loads 200 products with explicit prices", async () => {
    const products = await getProducts();
    const slugs = new Set(products.map((product) => product.slug));

    expect(products).toHaveLength(200);
    expect(slugs.size).toBe(200);
    expect(formatPrice(24900, "ZAR")).toContain("249");
    expect(formatPrice(1900, "USD")).toContain("19");

    for (const product of products) {
      for (const currency of currencies) {
        expect(Number.isInteger(product.prices[currency])).toBe(true);
        expect(product.prices[currency]).toBeGreaterThan(0);
      }
    }
  });

  it("groups every product into a category", async () => {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    const counted = categories.reduce((total, category) => total + category.count, 0);

    expect(categories.length).toBeGreaterThan(0);
    expect(counted).toBe(products.length);
  });
});