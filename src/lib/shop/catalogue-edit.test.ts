import { describe, expect, it } from "vitest";
import type { ShopProduct } from "@/lib/shop/catalogue";
import {
  majorToCents,
  mergeCatalogue,
  nextProductId,
  productToRecord,
  withFlatPrices,
} from "@/lib/shop/catalogue-edit";

function sample(id: string, slug: string): ShopProduct {
  return {
    id,
    slug,
    name: id,
    category: "finance",
    categorySlug: "personal-finance",
    categoryLabel: "Personal finance",
    productType: "Workbook",
    audience: "Households",
    version: "1.0.0",
    licence: "personal",
    summary: "A budget.",
    description: "Plan the month.",
    benefits: [],
    compatibility: [],
    tags: [],
    prices: { ZAR: 24900, USD: 1900, GBP: 1500, EUR: 1700 },
  };
}

describe("catalogue edits", () => {
  it("reads a rand amount as cents", () => {
    expect(majorToCents("5")).toBe(500);
    expect(majorToCents("5,00")).toBe(500);
    expect(majorToCents("0")).toBeNull();
  });

  it("hides a removed product and keeps an added one", () => {
    const files = [sample("FIN-001", "household"), sample("FIN-002", "debt")];
    const removed = productToRecord(files[1], true);
    const added = productToRecord({
      ...sample("CUS-001", "new-pack"),
      name: "New pack",
      prices: { ZAR: 500, USD: 500, GBP: 500, EUR: 500 },
    });
    const priced = productToRecord(withFlatPrices(files[0]));

    const products = mergeCatalogue(files, [priced, removed, added]);

    expect(products.map((product) => product.id)).toEqual(["CUS-001", "FIN-001"]);
    expect(products.find((product) => product.id === "FIN-001")?.prices.ZAR).toBe(500);
    expect(products.find((product) => product.id === "CUS-001")?.name).toBe("New pack");
  });

  it("numbers new products after the last custom id", () => {
    expect(nextProductId(["FIN-001", "CUS-003", "CUS-010"])).toBe("CUS-011");
  });
});
