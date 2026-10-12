import assert from "node:assert/strict";
import test from "node:test";
import { readToken, signToken } from "./token.mjs";

test("accepts a fresh token and rejects a tampered one", () => {
  const token = signToken({ file: "FIN-001" }, "test-secret", 60, 1_000);
  assert.equal(readToken(token, "test-secret", 1_000).file, "FIN-001");
  assert.equal(readToken(token.slice(0, -1) + "x", "test-secret", 1_000), null);
});

test("rejects an expired token", () => {
  const token = signToken({ file: "FIN-001" }, "test-secret", 10, 1_000);
  assert.equal(readToken(token, "test-secret", 20_000), null);
});
