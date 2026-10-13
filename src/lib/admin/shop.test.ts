import { describe, expect, it } from "vitest";
import { summariseOrderRows } from "@/lib/admin/shop";

describe("summariseOrderRows", () => {
  it("counts each status and totals paid rand only", () => {
    const summary = summariseOrderRows([
      { status: "PAID", currency: "ZAR", count: 2, amountCents: 49800 },
      { status: "PAID", currency: "USD", count: 1, amountCents: 1900 },
      { status: "PENDING", currency: "ZAR", count: 3, amountCents: 74700 },
      { status: "FAILED", currency: "ZAR", count: 1, amountCents: 24900 },
    ]);

    expect(summary.counts).toEqual({
      PENDING: 3,
      PAID: 3,
      FAILED: 1,
      CANCELLED: 0,
    });
    expect(summary.paidCents).toBe(49800);
  });
});