import { describe, expect, it } from "vitest";
import {
  customerFilePath,
  customerMayDownload,
  safeCustomerRelative,
} from "@/lib/shop/deliver";

describe("product delivery", () => {
  it("rejects paths that leave the product folder", () => {
    expect(safeCustomerRelative("../internal/meta.json")).toBeNull();
    expect(safeCustomerRelative("preview/../../secret")).toBeNull();
    expect(safeCustomerRelative("README.md")).toBe("README.md");
    expect(customerFilePath("FIN-001", "../internal/meta.json")).toBeNull();
    expect(customerFilePath("nope", "README.md")).toBeNull();
  });

  it("allows a download only for a paid order that includes the product", () => {
    const paid = { status: "PAID", items: [{ productId: "FIN-001" }] };
    expect(customerMayDownload(paid, "FIN-001")).toBe(true);
    expect(customerMayDownload(paid, "FIN-002")).toBe(false);
    expect(customerMayDownload({ status: "PENDING", items: [{ productId: "FIN-001" }] }, "FIN-001")).toBe(
      false,
    );
    expect(customerMayDownload(null, "FIN-001")).toBe(false);
  });
});
