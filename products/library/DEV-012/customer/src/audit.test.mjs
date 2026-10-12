import assert from "node:assert/strict";
import test from "node:test";
import { auditEvent } from "./audit.mjs";

test("builds a record and rejects a missing subject", () => {
  const event = auditEvent({ actorId: "admin-1", action: "archive-product", subjectType: "product", subjectId: "FIN-001", reason: "Replaced by version 1.1.0" });
  assert.equal(event.subjectId, "FIN-001");
  assert.throws(() => auditEvent({ actorId: "admin-1", action: "archive-product" }));
});
