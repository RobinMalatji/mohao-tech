# Retry with backoff

*DEV-005 · version 1.0.0*

Retry an async function with a capped delay and a fixed number of attempts.

Calls your function again when it throws, waiting longer each time, up to a cap. The delay function is injected so the test does not sleep. It does not decide which errors are safe to retry. You pass that predicate.

## Files in this package

- package.json
- src/retry.mjs
- src/retry.test.mjs
- LICENCE.md
- USAGE.md
- preview/cover.svg
- preview/cover.png
- manifest.json

## Product details

| Field | Value |
| --- | --- |
| Product code | DEV-005 |
| Version | 1.0.0 |
| Category | Developer products |
| Type | JavaScript source with node:test |
| Licence | developer-project |

> These are small source files for you to read, test, and adapt. They are not a hosted service and they are not a security audit.
