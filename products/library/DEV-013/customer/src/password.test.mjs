import assert from "node:assert/strict";
import test from "node:test";
import { passwordProblems } from "./password.mjs";

test("accepts a long mixed password and rejects a short one", () => {
  assert.deepEqual(passwordProblems("river-lantern-42"), []);
  assert.ok(passwordProblems("short1").length > 0);
});
