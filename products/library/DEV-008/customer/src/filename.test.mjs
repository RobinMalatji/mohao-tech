import assert from "node:assert/strict";
import test from "node:test";
import { safeFileName } from "./filename.mjs";

test("keeps an ordinary product file name", () => {
  assert.equal(safeFileName("FIN-001.zip"), "FIN-001.zip");
});

test("rejects a parent path and a reserved name", () => {
  assert.throws(() => safeFileName("../secret.zip"));
  assert.throws(() => safeFileName("CON.txt"));
});
