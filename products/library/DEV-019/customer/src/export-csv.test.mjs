import assert from "node:assert/strict";
import test from "node:test";
import { objectsToCsv } from "./export-csv.mjs";

test("exports only the named columns", () => {
  const csv = objectsToCsv([{ id: "FIN-001", note: "keep private", name: "Budget" }], ["id", "name"]);
  assert.equal(csv.includes("keep private"), false);
  assert.equal(csv.split("\n")[0], "id,name");
});
