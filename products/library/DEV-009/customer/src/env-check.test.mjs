import assert from "node:assert/strict";
import test from "node:test";
import { missingEnvKeys } from "./env-check.mjs";

test("reports only the empty keys", () => {
  const example = "# comment\nDATABASE_URL=\nAUTH_SECRET=replace\n";
  assert.deepEqual(missingEnvKeys(example, { DATABASE_URL: "postgres://local", AUTH_SECRET: "" }), ["AUTH_SECRET"]);
});
