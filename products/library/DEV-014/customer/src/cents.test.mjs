import assert from "node:assert/strict";
import test from "node:test";
import { addCents, subtractCents } from "./cents.mjs";

test("adds line items and rejects a discount that is too large", () => {
  assert.equal(addCents([24900, 14900]), 39800);
  assert.equal(subtractCents(39800, 5000), 34800);
  assert.throws(() => subtractCents(100, 101));
});
