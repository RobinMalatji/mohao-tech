# Idempotency memory

*DEV-011 · version 1.0.0*

Remember the first result for a key and return it on the next call.

Stores one result per key in memory for a TTL. A second call with the same key does not run the task again. Use it to avoid duplicate fulfilment in a single process. A restart clears it, so a database is still required for production payments.

## Files in this package

- package.json
- src/idempotency.mjs
- src/idempotency.test.mjs
- LICENCE.md
- USAGE.md
- preview/cover.svg
- preview/cover.png
- manifest.json

## Product details

| Field | Value |
| --- | --- |
| Product code | DEV-011 |
| Version | 1.0.0 |
| Category | Developer products |
| Type | JavaScript source with node:test |
| Licence | developer-project |

> These are small source files for you to read, test, and adapt. They are not a hosted service and they are not a security audit.
