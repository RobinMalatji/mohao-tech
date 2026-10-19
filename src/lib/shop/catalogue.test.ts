import { describe, expect, it } from "vitest";
import { getCategories, getProducts } from "@/lib/shop/catalogue";
import { currencies, formatPrice } from "@/lib/shop/money";
import { getProductPreview, readPreviewSvg } from "@/lib/shop/preview";

describe("shop catalogue", () => {
  it("loads 10 products with explicit prices", async () => {
    const products = await getProducts();
    const slugs = new Set(products.map((product) => product.slug));

    expect(products).toHaveLength(10);
    expect(slugs.size).toBe(10);
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

    expect(categories).toHaveLength(10);
    expect(categories.every((category) => category.count === 1)).toBe(true);
    expect(counted).toBe(products.length);
  });

  it("shows the product and keeps the download locked", async () => {
    const [finance, prompts, design, missing] = await Promise.all([
      getProductPreview("FIN-001"),
      getProductPreview("AI-001"),
      getProductPreview("DSN-001"),
      getProductPreview("NOPE-999"),
    ]);

    expect(finance?.sheets.map((sheet) => sheet.name)).toContain("Inputs");
    expect(finance?.sheets.some((sheet) => sheet.rows.some((row) => row.includes("Rent")))).toBe(
      true,
    );
    expect(finance?.locked).toMatch(/download/i);

    const promptTitles = prompts?.sections.map((section) => section.title) ?? [];
    expect(promptTitles).toContain("List observations");
    expect(promptTitles).toContain("Contradictions");
    const openPrompt = prompts?.sections.find((section) => section.title === "List observations");
    const closedPrompt = prompts?.sections.find((section) => section.title === "Contradictions");
    expect(openPrompt?.blocks?.some((block) => block.type === "p" && block.text.includes("anonymised notes"))).toBe(
      true,
    );
    expect(closedPrompt?.blocks).toBeUndefined();

    expect(design?.gallery.length).toBeGreaterThan(1);
    expect(await readPreviewSvg("DSN-001", 0)).toContain("<svg");
    expect(await readPreviewSvg("DSN-001", 1)).toContain("<svg");
    expect(await readPreviewSvg("FIN-001", 0)).toBeNull();
    expect(missing).toBeNull();
  });
});