import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import test from "node:test";
import { hmacMatches } from "./hmac.mjs";

test("accepts the hex digest of the same body", () => {
  const body = '{"id":"evt_1"}';
  const signature = createHmac("sha256", "whsec_test").update(body).digest("hex");
  assert.equal(hmacMatches(body, "whsec_test", signature), true);
  assert.equal(hmacMatches(body + " ", "whsec_test", signature), false);
});
