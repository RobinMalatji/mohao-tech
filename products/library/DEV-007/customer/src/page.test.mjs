import assert from "node:assert/strict";
import test from "node:test";
import { pageWindow } from "./page.mjs";

test("calculates the offset for page 3", () => {
  assert.deepEqual(pageWindow(3, 20), { page: 3, limit: 20, offset: 40 });
});

test("caps the page size and rejects page zero", () => {
  assert.equal(pageWindow(1, 500).limit, 50);
  assert.throws(() => pageWindow(0, 10));
});
