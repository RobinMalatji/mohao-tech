import assert from "node:assert/strict";
import test from "node:test";
import { createWindowLimiter } from "./rate-limit.mjs";

test("blocks the fourth call inside the window", () => {
  let time = 1_000;
  const limiter = createWindowLimiter(3, 10_000, () => time);
  assert.equal(limiter.check("a").allowed, true);
  assert.equal(limiter.check("a").allowed, true);
  assert.equal(limiter.check("a").allowed, true);
  assert.equal(limiter.check("a").allowed, false);
  time = 12_000;
  assert.equal(limiter.check("a").allowed, true);
});
