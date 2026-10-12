import { describe, expect, it } from "vitest";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { currencies, formatPrice } from "@/lib/shop/money";
import { getProductPreview, readPreviewSvg } from "@/lib/shop/preview";

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

  it("previews an opening sample and keeps the rest back", async () => {
    const [finance, prompts, design, missing] = await Promise.all([
      getProductPreview("FIN-001"),
      getProductPreview("AI-001"),
      getProductPreview("DSN-001"),
      getProductPreview("NOPE-999"),
    ]);

    expect(finance?.kind).toBe("text");
    expect(finance?.text).toContain("Household monthly budget");
    expect(finance?.text).not.toContain("Worked example");
    expect(finance?.clipped).toBe(true);
    expect(finance?.hiddenFiles).toBeGreaterThan(0);

    expect(prompts?.text).toContain("List observations");
    expect(prompts?.text).not.toContain("Contradictions");
    expect(prompts?.hiddenFiles).toBeGreaterThan(0);

    expect(design?.kind).toBe("image");
    expect(design?.imagePath).toBe("designs/slide-01-problem.svg");
    expect(design?.hiddenFiles).toBeGreaterThan(1);
    expect(await readPreviewSvg("DSN-001")).toContain("<svg");
    expect(await readPreviewSvg("FIN-001")).toBeNull();
    expect(missing).toBeNull();
  });
});