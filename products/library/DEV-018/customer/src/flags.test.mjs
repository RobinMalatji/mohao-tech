import assert from "node:assert/strict";
import test from "node:test";
import { flagEnabled } from "./flags.mjs";

test("treats only true and 1 as enabled", () => {
  assert.equal(flagEnabled({ SHOP_ENABLED: "true" }, "SHOP_ENABLED"), true);
  assert.equal(flagEnabled({ SHOP_ENABLED: "false" }, "SHOP_ENABLED"), false);
  assert.equal(flagEnabled({}, "SHOP_ENABLED"), false);
});
