export function auditEvent(input, now = () => new Date("2026-10-12T12:00:00.000Z")) {
  if (!input.actorId || !input.action || !input.subjectType || !input.subjectId) {
    throw new Error("Audit events need an actor, an action, and a subject.");
  }
  return {
    at: now().toISOString(),
    actorId: String(input.actorId),
    action: String(input.action),
    subjectType: String(input.subjectType),
    subjectId: String(input.subjectId),
    reason: input.reason ? String(input.reason) : "",
  };
}
