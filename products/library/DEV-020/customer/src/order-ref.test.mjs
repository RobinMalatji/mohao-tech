import assert from "node:assert/strict";
import test from "node:test";
import { orderReference } from "./order-ref.mjs";

test("includes the date and the supplied bytes", () => {
  const reference = orderReference(new Date("2026-10-12T08:00:00.000Z"), () => Buffer.from([1, 2, 3, 4]));
  assert.equal(reference, "MH-20261012-01020304");
});
