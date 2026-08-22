import { describe, expect, it } from "vitest";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests under the limit and blocks extras", () => {
    resetRateLimit("test-key");
    expect(rateLimit("test-key", 2, 60_000).success).toBe(true);
    expect(rateLimit("test-key", 2, 60_000).success).toBe(true);
    const blocked = rateLimit("test-key", 2, 60_000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets an individual key", () => {
    resetRateLimit("reset-key");
    rateLimit("reset-key", 1, 60_000);
    expect(rateLimit("reset-key", 1, 60_000).success).toBe(false);
    resetRateLimit("reset-key");
    expect(rateLimit("reset-key", 1, 60_000).success).toBe(true);
  });
});
