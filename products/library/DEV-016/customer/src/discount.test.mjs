import assert from "node:assert/strict";
import test from "node:test";
import { applyDiscount } from "./discount.mjs";

test("takes 15 percent and rejects a fixed discount that is too big", () => {
  assert.deepEqual(applyDiscount(20000, { type: "percent", basisPoints: 1500 }), { reduction: 3000, total: 17000 });
  assert.throws(() => applyDiscount(1000, { type: "fixed", cents: 1001 }));
});
