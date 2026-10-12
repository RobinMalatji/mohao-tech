import assert from "node:assert/strict";
import test from "node:test";
import { retry } from "./retry.mjs";

test("returns the value when a later attempt succeeds", async () => {
  const waits = [];
  let calls = 0;
  const value = await retry(async () => {
    calls += 1;
    if (calls < 3) throw new Error("not yet");
    return "ok";
  }, { attempts: 3, baseMs: 10, wait: async (delay) => waits.push(delay) });
  assert.equal(value, "ok");
  assert.deepEqual(waits, [10, 20]);
});

test("stops when the predicate rejects the error", async () => {
  await assert.rejects(() => retry(async () => {
    throw new Error("no");
  }, { attempts: 5, shouldRetry: () => false, wait: async () => { throw new Error("should not wait"); } }));
});
