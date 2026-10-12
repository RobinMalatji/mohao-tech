import assert from "node:assert/strict";
import test from "node:test";
import { bucketKey } from "./buckets.mjs";

test("puts a Wednesday into the Monday of that week", () => {
  assert.equal(bucketKey("2026-10-14T21:00:00.000Z", "week"), "2026-10-12");
  assert.equal(bucketKey("2026-10-14T21:00:00.000Z", "month"), "2026-10");
});
