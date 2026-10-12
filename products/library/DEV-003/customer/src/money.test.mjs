import assert from "node:assert/strict";
import test from "node:test";
import { formatMoney } from "./money.mjs";

test("formats rand from cents", () => {
  assert.match(formatMoney(1999, "ZAR"), /19[,.]99/);
});

test("rejects a float and an unknown currency", () => {
  assert.throws(() => formatMoney(19.99, "ZAR"));
  assert.throws(() => formatMoney(100, "JPY"));
});
