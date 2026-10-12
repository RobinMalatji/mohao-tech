import assert from "node:assert/strict";
import test from "node:test";
import { createMemoryIdempotency } from "./idempotency.mjs";

test("runs the task once for a repeated key", async () => {
  let calls = 0;
  const store = createMemoryIdempotency(1000, () => 500);
  const first = await store.run("order-1", async () => {
    calls += 1;
    return { ok: true };
  });
  const second = await store.run("order-1", async () => {
    calls += 1;
    return { ok: false };
  });
  assert.equal(calls, 1);
  assert.deepEqual(second, first);
});
