import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv, writeCsv } from "./csv.mjs";

test("reads a quoted comma and an escaped quote", () => {
  const rows = parseCsv('a,"b,c","d""e"\n');
  assert.deepEqual(rows, [["a", "b,c", 'd"e']]);
});

test("round-trips a field that contains a comma", () => {
  const csv = writeCsv([["Cape Town", "Salt River, 7925"]]);
  assert.deepEqual(parseCsv(csv), [["Cape Town", "Salt River, 7925"]]);
});
